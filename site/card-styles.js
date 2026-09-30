// Dynasty Builders Academy — Digital Business Card shared config.
// Loaded by BOTH business-card-editor.html and card.html so the style an
// agent previews is exactly the style the public sees. The chosen style id
// is what gets stored in Monday (Card Style column); everything else about
// a style lives only here, so a style can be refined later without
// touching any saved card.

const CARD_BOARD_ID = 18433397468;
const CARD_COLS = {
  agentId:   'text_mm7p2dkj',
  tagline:   'text_mm7py7s',
  phone:     'phone_mm7psgct',
  email:     'email_mm7pjwsq',
  address:   'text_mm7pgqq7',
  bio:       'long_text_mm7psmfr',
  social:    'long_text_mm7pvbq6',
  photo:     'text_mm7pbkh',
  materials: 'long_text_mm7p6y32',
  style:     'text_mm7pz4w9',
};

// Every text/background pair below was checked for WCAG AA contrast
// (4.5:1 body text, 3:1 large text) — see the build notes.
const CARD_STYLES = [
  { id:'dynasty-gold', name:'Dynasty Gold',  bg:'#F5F1E8', card:'#FFFFFF', header:'linear-gradient(135deg,#E8C97A,#C9A84C)', headerText:'#1E1A10', text:'#1E1A10', muted:'#4A5568', accent:'#7A5C14', btn:'#1E1A10', btnText:'#F5F1E8', font:"'Cormorant Garamond',serif" },
  { id:'midnight',     name:'Midnight Navy', bg:'#0B1D3A', card:'#13284D', header:'linear-gradient(135deg,#0B1D3A,#1F3B6E)', headerText:'#F5E8C0', text:'#F5F1E8', muted:'#B8C4D6', accent:'#E8C97A', btn:'#E8C97A', btnText:'#0B1D3A', font:"'Cormorant Garamond',serif" },
  { id:'emerald',      name:'Emerald',       bg:'#ECF5EF', card:'#FFFFFF', header:'linear-gradient(135deg,#0F5132,#1E7A46)', headerText:'#FFFFFF', text:'#10261A', muted:'#3F5A4A', accent:'#14613A', btn:'#14613A', btnText:'#FFFFFF', font:"'DM Sans',sans-serif" },
  { id:'royal',        name:'Royal Purple',  bg:'#F3EEF8', card:'#FFFFFF', header:'linear-gradient(135deg,#3B1F6B,#6A3FA0)', headerText:'#FFFFFF', text:'#1F1430', muted:'#4F4263', accent:'#5B2E91', btn:'#3B1F6B', btnText:'#FFFFFF', font:"'Cormorant Garamond',serif" },
  { id:'crimson',      name:'Crimson',       bg:'#FBF1F0', card:'#FFFFFF', header:'linear-gradient(135deg,#8E1B1B,#C0392B)', headerText:'#FFFFFF', text:'#2A1212', muted:'#5C4040', accent:'#9B1C1C', btn:'#8E1B1B', btnText:'#FFFFFF', font:"'DM Sans',sans-serif" },
  { id:'ocean',        name:'Ocean Blue',    bg:'#EEF5FB', card:'#FFFFFF', header:'linear-gradient(135deg,#0C4A6E,#1D74B5)', headerText:'#FFFFFF', text:'#0E2233', muted:'#3D5366', accent:'#0C5A8A', btn:'#0C4A6E', btnText:'#FFFFFF', font:"'DM Sans',sans-serif" },
  { id:'minimal',      name:'Clean Minimal', bg:'#FFFFFF', card:'#FFFFFF', header:'linear-gradient(135deg,#F2F2F2,#E4E4E4)', headerText:'#1A1A1A', text:'#1A1A1A', muted:'#555555', accent:'#1A1A1A', btn:'#1A1A1A', btnText:'#FFFFFF', font:"'DM Sans',sans-serif" },
  { id:'rose-gold',    name:'Rose Gold',     bg:'#FBF3F1', card:'#FFFFFF', header:'linear-gradient(135deg,#B76E79,#E0A99E)', headerText:'#2B1418', text:'#2B1418', muted:'#5E4549', accent:'#8C4450', btn:'#8C4450', btnText:'#FFFFFF', font:"'Cormorant Garamond',serif" },
  { id:'sunset',       name:'Sunset',        bg:'#FFF4EC', card:'#FFFFFF', header:'linear-gradient(135deg,#C2410C,#F59E0B)', headerText:'#1F1206', text:'#26170B', muted:'#5F4636', accent:'#9A3412', btn:'#9A3412', btnText:'#FFFFFF', font:"'DM Sans',sans-serif" },
  { id:'onyx',         name:'Onyx',          bg:'#0E0E10', card:'#1A1A1E', header:'linear-gradient(135deg,#1A1A1E,#3A3A42)', headerText:'#E5E5EA', text:'#F2F2F5', muted:'#B4B4BD', accent:'#D4D4DC', btn:'#E5E5EA', btnText:'#0E0E10', font:"'DM Sans',sans-serif" },
];
const DEFAULT_CARD_STYLE = 'dynasty-gold';
function getCardStyle(id) { return CARD_STYLES.find(s => s.id === id) || CARD_STYLES[0]; }

// Materials an agent can feature. Only pages that actually exist and are
// public (no login) belong here — every link carries ?agent= so leads
// credit the agent, and &campaign=business_card so they're traceable.
const CARD_MATERIALS = [
  { id:'retirement-readiness', icon:'🎯', title:'Retirement Readiness Survey',          desc:'A 3-minute check on where your retirement stands.',         file:'retirement-readiness.html' },
  { id:'fin-number',           icon:'📘', title:'Your Financial Independence Number', desc:'How to retire in 10 years or less — free guide.',          file:'financial-independence-number.html' },
  { id:'financial-survey',     icon:'📋', title:'Financial Needs Survey',               desc:'Find out where your protection and planning gaps are.',     file:'survey.html' },
  { id:'coverage-finder',      icon:'🛡️', title:'Find Your Coverage',                  desc:'See which life insurance options fit your situation.',      file:'client-questionnaire.html' },
  { id:'prequal',              icon:'✅', title:'Coverage Pre-Qualification',           desc:'Quick calculators to see what you may qualify for.',       file:'prequal.html' },
  { id:'adversity',            icon:'🌱', title:'Adversity Response Assessment',        desc:'How do you handle setbacks? A 3-minute self-check.',        file:'adversity-assessment.html' },
  { id:'community-survey',     icon:'🏙️', title:'Greater LA Financial Education Survey', desc:'Help shape better financial education for your community.', file:'community-research-survey.html' },
];

const CARD_SOCIALS = [
  { id:'instagram', label:'Instagram', icon:'📸', placeholder:'https://instagram.com/yourname' },
  { id:'facebook',  label:'Facebook',  icon:'📘', placeholder:'https://facebook.com/yourpage' },
  { id:'linkedin',  label:'LinkedIn',  icon:'💼', placeholder:'https://linkedin.com/in/yourname' },
  { id:'tiktok',    label:'TikTok',    icon:'🎵', placeholder:'https://tiktok.com/@yourname' },
  { id:'youtube',   label:'YouTube',   icon:'▶️', placeholder:'https://youtube.com/@yourchannel' },
  { id:'x',         label:'X / Twitter', icon:'✖️', placeholder:'https://x.com/yourname' },
  { id:'website',   label:'Website',   icon:'🌐', placeholder:'https://yourwebsite.com' },
  { id:'calendly',  label:'Book a Call', icon:'📅', placeholder:'https://calendly.com/yourname' },
];

// Only allow http(s) links on a public page — blocks javascript: and other
// schemes an agent could paste in (accidentally or not).
function safeUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  const withScheme = /^https?:\/\//i.test(s) ? s : 'https://' + s.replace(/^\/+/, '');
  try { const p = new URL(withScheme); return (p.protocol === 'http:' || p.protocol === 'https:') ? p.href : ''; } catch (e) { return ''; }
}
// Monday stores US numbers with the country code (e.g. 13105551234);
// show them the way people read them.
function formatPhone(p) {
  const d = String(p || '').replace(/\D/g, '');
  const n = d.length === 11 && d[0] === '1' ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6)}` : String(p || '');
}
function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// Reads one agent's card from Monday. Used by both pages.
async function fetchCardFromMonday(agentId, proxyUrl) {
  const q = `query($b:ID!,$c:String!,$v:[String]!){
    items_page_by_column_values(board_id:$b, limit:1, columns:[{column_id:$c, column_values:$v}]){
      items{ id name column_values{ id text value } } } }`;
  const res = await fetch(proxyUrl, { method:'POST', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ query:q, variables:{ b:String(CARD_BOARD_ID), c:CARD_COLS.agentId, v:[agentId] } }) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.errors) throw new Error(data.errors[0]?.message || 'Monday error');
  const item = data.data?.items_page_by_column_values?.items?.[0];
  if (!item) return null;
  const col = id => item.column_values.find(c => c.id === id) || {};
  const parseJSON = (t, fb) => { try { return t ? JSON.parse(t) : fb; } catch (e) { return fb; } };
  return {
    itemId: item.id,
    name: item.name,
    agentId: col(CARD_COLS.agentId).text || agentId,
    tagline: col(CARD_COLS.tagline).text || '',
    phone: col(CARD_COLS.phone).text || '',
    email: col(CARD_COLS.email).text || '',
    address: col(CARD_COLS.address).text || '',
    bio: col(CARD_COLS.bio).text || '',
    social: parseJSON(col(CARD_COLS.social).text, {}),
    photo: col(CARD_COLS.photo).text || '',
    materials: parseJSON(col(CARD_COLS.materials).text, []),
    style: col(CARD_COLS.style).text || DEFAULT_CARD_STYLE,
  };
}
