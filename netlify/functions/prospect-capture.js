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
async function saveProspectToTop25({ proxyUrl = '/api/monday', boardId, first = '', last = '', phone = '', email = '', note = '', source = 'QR / Share Link', agentName = '' }) {
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
  const noteText = [`${source} · ${today}${agentName ? ' · for ' + agentName : ''}`, note.trim()].filter(Boolean).join(' — ').slice(0, 1000);

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
    return { ok: true, itemId: d.create_item.id, boardId: board, partial: false };
  } catch (e) {
    // Save the name no matter what, with everything else folded into the item name.
    try {
      const d = await _pcQuery(proxyUrl, 'mutation($b:ID!,$n:String!){create_item(board_id:$b,item_name:$n){id}}',
        { b: board, n: [fullName, phone, email].filter(Boolean).join(' · ').slice(0, 255) });
      return { ok: true, itemId: d.create_item.id, boardId: board, partial: true, error: e.message };
    } catch (e2) {
      return { ok: false, boardId: board, error: e2.message };
    }
  }
}
