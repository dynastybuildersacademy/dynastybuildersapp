// Dynasty Builders Academy — shared "add me to your Top 25" intake.
// Used by add-me.html (the original QR page) and card.html (the public
// business card) so a prospect is saved the same way either way.
//
// Why this exists: the old add-me code guessed columns by keyword and
// sent every value in one fixed shape. On the real Top 25 boards "Email"
// is a TEXT column but was sent in email-column format — Monday rejects
// the whole item when that happens, so any prospect who typed an email
// was never saved (not even their name), while still seeing "You're all
// set!". Items that did save went to the board's top group ("Started
// Enrollment Process") instead of "New Prospects for The Week", and the
// agent's NAME was written into the "Agent ID" column.
//
// Here columns are matched by title AND type, each value is shaped for
// the column it's going into, the item goes in New Prospects, the name
// is passed as a GraphQL variable, and if Monday still rejects the write
// it retries with just the name so the prospect is never silently lost.
// Column lookups are fetched fresh (not cached on the visitor's phone),
// so a board change can't leave a stale mapping behind.

const TOP25_DEFAULT_BOARD = '8270757684';   // shared "Dynasty Builders Top 25"
const TOP25_PROXY = '/api/monday';

async function top25Gql(query, variables) {
  const res = await fetch(TOP25_PROXY, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: variables || {} }) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const body = await res.json();
  if (body.errors && body.errors.length) throw new Error(body.errors[0].message || 'Monday error');
  if (body.error_message) throw new Error(body.error_message);
  return body.data;
}

// Pure mapping — no network. Given a board's columns/groups and the
// prospect's fields, returns what to send.
function buildTop25Payload(columns, groups, f) {
  const t = c => String(c.title || '').trim().toLowerCase();
  const cv = {};
  const fullName = [f.first, f.last].filter(Boolean).join(' ').trim();

  columns.filter(c => c.type === 'text' && (t(c) === 'name' || t(c) === 'prospect name'))
         .forEach(c => { if (fullName) cv[c.id] = fullName; });

  const phoneCol = columns.find(c => c.type === 'phone' && t(c).includes('phone'));
  const digits = String(f.phone || '').replace(/\D/g, '');
  if (phoneCol && digits) cv[phoneCol.id] = { phone: digits, countryShortName: 'US' };

  // "Event Guest" columns are email-typed too — never put a prospect there
  const emailCol = columns.find(c => t(c).includes('email') && !t(c).includes('guest') && (c.type === 'email' || c.type === 'text'));
  if (emailCol && f.email) cv[emailCol.id] = emailCol.type === 'email' ? { email: f.email, text: f.email } : f.email;

  const via = `via ${f.source || 'QR code'}${f.agentName ? ' (referred by ' + f.agentName + ')' : ''}`;
  const notesCol = columns.find(c => t(c) === 'notes' && (c.type === 'text' || c.type === 'long_text'));
  if (notesCol) {
    const s = [f.note, via].filter(Boolean).join(' · ').slice(0, 900);
    cv[notesCol.id] = notesCol.type === 'long_text' ? { text: s } : s;
  }

  const agentCol = columns.find(c => c.type === 'text' && t(c) === 'agent id');
  if (agentCol && f.agentId) cv[agentCol.id] = f.agentId;

  const grp = (groups || []).find(g => String(g.title || '').toLowerCase().includes('new prospect'));
  return { columnValues: cv, groupId: grp ? grp.id : null,
           itemName: (fullName || f.phone || f.email || 'New Prospect').slice(0, 255) };
}

async function submitTop25Lead(f) {
  const boardId = String(f.boardId || TOP25_DEFAULT_BOARD);
  const result = { ok: false, degraded: false, itemId: null, boardId, error: null };
  try {
    const info = await top25Gql('query($b:[ID!]){boards(ids:$b){columns{id title type} groups{id title}}}', { b: [boardId] });
    const board = info && info.boards && info.boards[0];
    if (!board) throw new Error('Top 25 board ' + boardId + ' not found');
    const p = buildTop25Payload(board.columns, board.groups, f);
    const create = cv => top25Gql(
      'mutation($b:ID!,$n:String!,$v:JSON!' + (p.groupId ? ',$g:String!' : '') + '){create_item(board_id:$b,item_name:$n,column_values:$v' + (p.groupId ? ',group_id:$g' : '') + '){id}}',
      Object.assign({ b: boardId, n: p.itemName, v: JSON.stringify(cv) }, p.groupId ? { g: p.groupId } : {}));
    try {
      result.itemId = (await create(p.columnValues)).create_item.id;
    } catch (e) {
      console.warn('top25 intake: full save rejected, retrying with name only:', e.message);
      result.itemId = (await create({})).create_item.id;
      result.degraded = true; result.error = e.message;
    }
    result.ok = true;
  } catch (e) {
    result.error = e.message;
    console.error('top25 intake: Monday save failed:', e.message);
  }
  // Always notify the automation hook. If Monday failed, this is how the
  // lead still reaches the agent (once a Zapier hook is configured).
  try {
    fetch('/api/automations', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'top25_prospect', timestamp: new Date().toISOString(),
        agentId: f.agentId || '', agentName: f.agentName || '',
        data: { prospectName: [f.first, f.last].filter(Boolean).join(' '), phone: f.phone || '', email: f.email || '',
                note: f.note || '', referredBy: f.agentName || f.agentId || '', source: f.source || 'QR code',
                mondaySaved: result.ok, mondayPartial: result.degraded, mondayError: result.error || '' } })
    }).catch(() => {});
  } catch (e) {}
  return result;
}
