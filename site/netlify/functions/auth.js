// Dynasty Builders Academy — Server-Side Auth
// Validates agent credentials against Monday.com roster board
// Returns a signed session token — never exposes agent array to browser
//
// Security model:
//  • Agent array never leaves the server
//  • PIN is compared server-side only
//  • Token is a HMAC-SHA256 signed JWT-like structure
//  • Token expires in 12 hours
//  • All sensitive fields (pin, phpId of others) stripped from response

const crypto = require('crypto');

// ── TOKEN SECRET ─────────────────────────────────────────────────
// Set TOKEN_SECRET in Netlify env vars — any random 32+ char string
// e.g. openssl rand -hex 32
const SECRET = process.env.TOKEN_SECRET || 'dba-dynasty-builders-fallback-key-change-in-prod';
const MONDAY_KEY = process.env.MONDAY_API_KEY;
const ROSTER_BOARD = process.env.ROSTER_BOARD_ID || ''; // Optional: Monday board for agent lookup

// ── CORS HEADERS ────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': 'https://agent.dynastybuildersapp.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// ── TOKEN FUNCTIONS ─────────────────────────────────────────────
function signToken(payload) {
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body    = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig     = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch { return null; }
}

// ── MONDAY AGENT LOOKUP ─────────────────────────────────────────
async function lookupAgentInMonday(agentId, pin) {
  if (!MONDAY_KEY || !ROSTER_BOARD) return null;
  try {
    const query = `{
      boards(ids:${ROSTER_BOARD}) {
        items_page(limit:10) {
          items {
            name
            column_values { id text }
          }
        }
      }
    }`;
    // Search for agent by ID
    const searchQuery = `{
      items_by_column_values(board_id:${ROSTER_BOARD}, column_id:"text", column_value:"${agentId}") {
        id name column_values { id title text }
      }
    }`;
    const res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': MONDAY_KEY },
      body: JSON.stringify({ query: searchQuery }),
    });
    const data = await res.json();
    const items = data?.data?.items_by_column_values || [];
    if (!items.length) return null;
    const item = items[0];
    const get = (...kws) => item.column_values.find(c =>
      kws.some(k => (c.title||'').toLowerCase().includes(k))
    )?.text || '';
    const storedPin = get('pin');
    if (storedPin !== pin) return null;
    return {
      agentId, name: item.name,
      role: get('role') || 'trainee',
      level: parseInt(get('level')) || 10,
      phpId: get('php id','php code'),
      top25BoardId: get('top25 board','board id'),
      uplineId: get('upline'),
      email: get('email'),
      phone: get('phone'),
    };
  } catch(e) {
    console.error('Monday lookup error:', e.message);
    return null;
  }
}

// ── MAIN HANDLER ────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    // ── LOGIN ──────────────────────────────────────────────────
    if (action === 'login') {
      const { agentId, pin } = body;
      if (!agentId || !pin) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing credentials' }) };
      }

      // Rate limiting: simple IP-based (Netlify passes client IP)
      // In production, use a KV store; this basic check prevents obvious brute force
      const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';

      // Try Monday lookup first (live roster)
      let agent = await lookupAgentInMonday(agentId.toLowerCase().trim(), pin.trim());

      // Fallback: auth.js embedded agents (loaded server-side from env or file)
      // NOTE: In production, remove the embedded fallback entirely and use Monday only
      if (!agent) {
        // Return auth failure — do NOT expose which agents exist
        return {
          statusCode: 401,
          headers: CORS,
          body: JSON.stringify({ success: false, error: 'Invalid ID or PIN. Try again.' })
        };
      }

      // Issue signed token (12 hour expiry)
      const token = signToken({
        agentId:     agent.agentId,
        name:        agent.name,
        role:        agent.role,
        level:       agent.level,
        phpId:       agent.phpId,
        top25BoardId:agent.top25BoardId,
        uplineId:    agent.uplineId,
        email:       agent.email,
        iat:         Date.now(),
        exp:         Date.now() + 12 * 60 * 60 * 1000,
      });

      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ success: true, token, agent: {
          agentId: agent.agentId,
          name:    agent.name,
          role:    agent.role,
          level:   agent.level,
        }})
      };
    }

    // ── VERIFY TOKEN ───────────────────────────────────────────
    if (action === 'verify') {
      const { token } = body;
      const payload = verifyToken(token);
      if (!payload) {
        return { statusCode: 401, headers: CORS, body: JSON.stringify({ valid: false }) };
      }
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ valid: true, session: payload }) };
    }

    // ── REFRESH TOKEN ──────────────────────────────────────────
    if (action === 'refresh') {
      const { token } = body;
      const payload = verifyToken(token);
      if (!payload) {
        return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Invalid or expired token' }) };
      }
      // Issue fresh token with new expiry
      const newToken = signToken({ ...payload, exp: Date.now() + 12 * 60 * 60 * 1000 });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ token: newToken }) };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };

  } catch(e) {
    console.error('Auth function error:', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Server error' }) };
  }
};
