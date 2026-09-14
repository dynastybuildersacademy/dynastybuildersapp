// Dynasty Builders Academy — LinkedIn OAuth (OpenID Connect) Proxy
// Handles authorization-code exchange and profile lookup server-side.
//
// Setup required (Netlify env vars):
//   LINKEDIN_CLIENT_ID
//   LINKEDIN_CLIENT_SECRET
// Register the app at linkedin.com/developers with the "Sign In with
// LinkedIn using OpenID Connect" product, and add
//   https://<your-domain>/marketing.html
// as an authorized redirect URL.
//
// Scope: this only verifies the signed-in agent's own identity (openid
// profile email). LinkedIn's API does not allow third-party apps to send
// connection requests or messages on a user's behalf — the message
// generator in marketing.html produces text the agent copies and pastes
// into LinkedIn themselves.

const https = require('https');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function postForm(hostname, path, params) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(params.toString(), 'utf8');
    const req = https.request({
      hostname, path, method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.length },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJson(hostname, path, token) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname, path, method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    // Authorization code -> access token
    if (action === 'exchange') {
      const { code, redirectUri } = body;
      if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'LinkedIn app not configured (missing LINKEDIN_CLIENT_ID/SECRET)' }) };
      }
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      });
      const r = await postForm('www.linkedin.com', '/oauth/v2/accessToken', params);
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    // Signed-in agent's own profile (OpenID Connect userinfo)
    if (action === 'profile') {
      const { token } = body;
      if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'No token' }) };
      const r = await getJson('api.linkedin.com', '/v2/userinfo', token);
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
