// Dynasty Builders Academy — shared "add me to your Top 25" save logic.
// Used by add-me.html (the QR form) and card.html (the business card).
//
// Why this exists: add-me.html used to guess columns by title and write
// every value as plain text or a fixed shape. On the standard Top 25
// board, the column titled "Email" is a TEXT column, so the email-type
// value it sent made Monday reject the whole item — any visitor who
// typed an email saved nothing at all, while still seeing "You're all
// set!". This version reads each column's real type and formats values
// to match, and falls back to saving at least the name if anything is
// still rejected.
const PROSPECT_FALLBACK_BOARD = '8270757684';   // shared "Dynasty Builders Top 25"

function _pcFormat(col, v) {
  if (v == null || v === '') return undefined;
  switch (col.type) {
    case 'phone':     { const d = String(v).replace(/\D/g, ''); return d ? { phone: d, countryShortName: 'US' } : undefined; }
    case 'email':     return { email: String(v), text: String(v) };
    case 'long_text': return { text: String(v) };
    case 'date':      return { date: String(v) };
    case 'text':      return String(v);
    default:          return undefined;   // never guess a shape for status/people/etc.
  }
}

async function _pcQuery(proxyUrl, query, variables) {
  const res = await fetch(proxyUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: variables || {} }) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors[0].message || 'Monday error');
  return data.data;
}

// Returns { ok, itemId, boardId, partial, error }
async function saveProspectToTop25({ proxyUrl = '/api/monday', boardId, first = '', last = '', phone = '', email = '', note = '', source = 'QR / Share Link', agentName = '', agentId = '', via = '' }) {
  const board = String(boardId || PROSPECT_FALLBACK_BOARD);
  const fullName = [first, last].map(s => s.trim()).filter(Boolean).join(' ') || phone || email || 'New Prospect';
  let cols = [], groups = [];
  try {
    const d = await _pcQuery(proxyUrl, 'query($b:[ID!]){boards(ids:$b){columns{id title type} groups{id title}}}', { b: [board] });
    cols = d.boards?.[0]?.columns || []; groups = d.boards?.[0]?.groups || [];
  } catch (e) { /* fall through: we can still save the name */ }

  // Known Top 25 template columns first (what top25.html reads), then by title + type.
  const byId = id => cols.find(c => c.id === id);
  const byTitle = (re, types) => cols.find(c => re.test(c.title) && (!types || types.includes(c.type)));
  const pick = {
    phone: byId('phone_number__1') || byTitle(/phone/i, ['phone', 'text']),
    email: byId('dup__of_notes__1') || byTitle(/e-?mail/i, ['email', 'text']),
    notes: byId('text4__1') || byTitle(/^notes?$/i, ['text', 'long_text']),
  };
  const today = new Date().toISOString().slice(0, 10);
  const noteText = [`${leadSourceLabel(source, via)} · ${today}${agentName ? ' · for ' + agentName : ''}`, note.trim()].filter(Boolean).join(' — ').slice(0, 1000);

  const cv = {};
  const put = (col, v) => { if (!col) return; const f = _pcFormat(col, v); if (f !== undefined) cv[col.id] = f; };
  put(pick.phone, phone); put(pick.email, email); put(pick.notes, noteText);

  // Land in the "New Prospects" group when the board has one.
  const group = groups.find(g => /new prospect/i.test(g.title));
  const create = (values) => _pcQuery(proxyUrl,
    `mutation($b:ID!,$n:String!,$v:JSON!${group ? ',$g:String' : ''}){create_item(board_id:$b,item_name:$n,column_values:$v,create_labels_if_missing:true${group ? ',group_id:$g' : ''}){id}}`,
    { b: board, n: fullName.slice(0, 255), v: JSON.stringify(values), ...(group ? { g: group.id } : {}) });

  try {
    const d = await create(cv);
    logProspectLead({ proxyUrl, agentId, source, via, phone, top25Item: d.create_item.id });   // not awaited
    return { ok: true, itemId: d.create_item.id, boardId: board, partial: false };
  } catch (e) {
    // Save the name no matter what, with everything else folded into the item name.
    try {
      const d = await _pcQuery(proxyUrl, 'mutation($b:ID!,$n:String!){create_item(board_id:$b,item_name:$n){id}}',
        { b: board, n: [fullName, phone, email].filter(Boolean).join(' · ').slice(0, 255) });
      logProspectLead({ proxyUrl, agentId, source, via, phone, top25Item: d.create_item.id });   // saved as a name-only item; still a real lead
      return { ok: true, itemId: d.create_item.id, boardId: board, partial: true, error: e.message };
    } catch (e2) {
      return { ok: false, boardId: board, error: e2.message };
    }
  }
}


// ── LEAD LOG ────────────────────────────────────────────────────────────
// One tiny row per prospect that arrives through an agent's business card,
// QR code or share link. The prospect's own phone submits the form, so a
// count can't live in the agent's browser — the activity tracker reads this
// board instead. No names, phone numbers or emails are stored here (those
// stay on the agent's Top 25 board): just who, which source, which day, and
// whether a phone number was given.
const LEAD_LOG_BOARD = '18433747641';
const LEAD_LOG_COLS = { agentId:'text_mm7rxrqv', source:'text_mm7rks3', hasPhone:'text_mm7rztyn', date:'date_mm7r91dn', top25Item:'text_mm7rcdxq' };

// QR scans are tagged with via=qr in the URL the QR code encodes; links
// shared by text/WhatsApp/email/copy are not.
function leadSourceLabel(source, via) {
  if (String(via || '').toLowerCase() === 'qr') return 'QR Code';
  return /business card/i.test(source || '') ? 'Business Card' : 'Share Link';
}

// Fire-and-forget: a failure here must never block or spoil the prospect's
// submission, so errors are swallowed (and noted in the console).
async function logProspectLead({ proxyUrl = '/api/monday', agentId, source, via, phone = '', top25Item = '' }) {
  if (!agentId) return false;
  const label = leadSourceLabel(source, via);
  const date = new Date().toISOString().slice(0, 10);
  const hasPhone = String(phone).replace(/\D/g, '').length >= 7 ? 'yes' : 'no';
  const cv = {
    [LEAD_LOG_COLS.agentId]: String(agentId),
    [LEAD_LOG_COLS.source]: label,
    [LEAD_LOG_COLS.hasPhone]: hasPhone,
    [LEAD_LOG_COLS.date]: { date },
    [LEAD_LOG_COLS.top25Item]: String(top25Item || ''),
  };
  try {
    await _pcQuery(proxyUrl, 'mutation($b:ID!,$n:String!,$v:JSON!){create_item(board_id:$b,item_name:$n,column_values:$v){id}}',
      { b: LEAD_LOG_BOARD, n: `${label} · ${date}`, v: JSON.stringify(cv) });
    return true;
  } catch (e) { console.warn('lead log write failed:', e.message); return false; }
}

// All logged leads for one agent: [{ date:'YYYY-MM-DD', at:<exact time Monday logged it>, source, hasPhone:bool }].
async function fetchAgentLeads(agentId, proxyUrl = '/api/monday') {
  const q = `query($b:ID!,$c:String!,$v:[String]!){ items_page_by_column_values(board_id:$b, limit:500, columns:[{column_id:$c, column_values:$v}]){ cursor items{ created_at column_values{ id text } } } }`;
  const nextQ = `query($cur:String!){ next_items_page(limit:500, cursor:$cur){ cursor items{ created_at column_values{ id text } } } }`;
  const out = [];
  const take = items => (items || []).forEach(it => {
    const col = id => (it.column_values.find(c => c.id === id) || {}).text || '';
    const date = col(LEAD_LOG_COLS.date);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) out.push({ date, at: it.created_at || '', source: col(LEAD_LOG_COLS.source), hasPhone: col(LEAD_LOG_COLS.hasPhone) === 'yes' });
  });
  let d = await _pcQuery(proxyUrl, q, { b: LEAD_LOG_BOARD, c: LEAD_LOG_COLS.agentId, v: [String(agentId)] });
  let page = d.items_page_by_column_values;
  take(page?.items);
  for (let i = 0; page?.cursor && i < 20; i++) {
    d = await _pcQuery(proxyUrl, nextQ, { cur: page.cursor });
    page = d.next_items_page; take(page?.items);
  }
  return out;
}
