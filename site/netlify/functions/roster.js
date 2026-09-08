// Dynasty Builders Academy — Roster Lookup Function
// Returns agent data for a specific agent or MD's downline
// Used by Top25 (shared MD board architecture) and agent directory
// NEVER returns PINs or full agent list

const MONDAY_KEY = process.env.MONDAY_API_KEY;
const ROSTER_BOARD = process.env.ROSTER_BOARD_ID || '';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dba-dynasty-builders-fallback-key-change-in-prod';
const crypto = require('crypto');

const CORS = {
  'Access-Control-Allow-Origin': 'https://agent.dynastybuildersapp.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  // Require valid auth token
  const authHeader = event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const session = verifyToken(token);
  if (!session) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    // ── GET DOWNLINE ─────────────────────────────────────────
    if (action === 'downline') {
      // Returns all agents whose uplineId matches the requesting agent
      // Only MDs and above (level >= 40) can see their downline
      if (session.level < 40) {
        return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'Insufficient permissions' }) };
      }
      if (!MONDAY_KEY || !ROSTER_BOARD) {
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ agents: [] }) };
      }
      const query = `{
        items_by_column_values(board_id:${ROSTER_BOARD}, column_id:"text4", column_value:"${session.agentId}") {
          id name column_values { id title text }
        }
      }`;
      const res = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': MONDAY_KEY },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const items = data?.data?.items_by_column_values || [];
      const agents = items.map(item => {
        const get = (...kws) => item.column_values.find(c =>
          kws.some(k => (c.title||'').toLowerCase().includes(k))
        )?.text || '';
        return {
          agentId: get('agent id'),
          name:    item.name,
          role:    get('role') || 'trainee',
          level:   parseInt(get('level')) || 10,
          top25BoardId: get('top25 board','board id'),
          phone:   get('phone'),
          email:   get('email'),
        };
      });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ agents }) };
    }

    // ── GET SHARED BOARD ID ──────────────────────────────────
    if (action === 'my_board') {
      // Returns the Top25 board ID for this agent
      // For shared MD board architecture: returns upline MD's board
      return {
        statusCode: 200, headers: CORS,
        body: JSON.stringify({ boardId: session.top25BoardId || null })
      };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch(e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Server error' }) };
  }
};
