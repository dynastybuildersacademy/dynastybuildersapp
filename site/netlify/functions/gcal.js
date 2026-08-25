// Dynasty Builders Academy — Google Calendar Proxy
// Handles OAuth token exchange and Calendar API calls server-side

const https = require('https');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? Buffer.from(JSON.stringify(body), 'utf8') : null;
    const req = https.request({
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': payload.length } : {}),
        ...(options.headers || {}),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  try {
    const { action, token, calendarId, eventData, eventId, query } = JSON.parse(event.body || '{}');

    // Token exchange (authorization code → access token)
    if (action === 'exchange') {
      const { code, redirectUri } = JSON.parse(event.body);
      const params = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });
      const r = await httpsRequest(
        { hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(params.toString()) } },
        null
      );
      // Need raw string for form-encoded
      const req2 = await new Promise((resolve, reject) => {
        const payload = Buffer.from(params.toString(), 'utf8');
        const req = https.request({ hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.length } },
          (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve({status:res.statusCode,body:d})); }
        );
        req.on('error', reject); req.write(payload); req.end();
      });
      return { statusCode: req2.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: req2.body };
    }

    // Refresh token
    if (action === 'refresh') {
      const { refreshToken } = JSON.parse(event.body);
      const params = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
      });
      const r = await new Promise((resolve, reject) => {
        const payload = Buffer.from(params.toString(), 'utf8');
        const req = https.request({ hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.length } },
          (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve({status:res.statusCode,body:d})); }
        );
        req.on('error', reject); req.write(payload); req.end();
      });
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'No token' }) };

    const authHeaders = { Authorization: `Bearer ${token}` };
    const calId = encodeURIComponent(calendarId || 'primary');

    // List calendars
    if (action === 'listCalendars') {
      const r = await httpsRequest({ hostname: 'www.googleapis.com', path: '/calendar/v3/users/me/calendarList', method: 'GET', headers: authHeaders });
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    // List events (duplicate check)
    if (action === 'listEvents') {
      const { timeMin, timeMax } = JSON.parse(event.body);
      const qs = new URLSearchParams({ timeMin, timeMax, singleEvents: 'true', maxResults: '50' });
      const r = await httpsRequest({ hostname: 'www.googleapis.com', path: `/calendar/v3/calendars/${calId}/events?${qs}`, method: 'GET', headers: authHeaders });
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    // Create event
    if (action === 'createEvent') {
      const payload = Buffer.from(JSON.stringify(eventData), 'utf8');
      const r = await httpsRequest({
        hostname: 'www.googleapis.com', path: `/calendar/v3/calendars/${calId}/events`,
        method: 'POST', headers: { ...authHeaders, 'Content-Length': payload.length },
      }, eventData);
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    // Update event
    if (action === 'updateEvent') {
      const payload = Buffer.from(JSON.stringify(eventData), 'utf8');
      const r = await httpsRequest({
        hostname: 'www.googleapis.com', path: `/calendar/v3/calendars/${calId}/events/${eventId}`,
        method: 'PUT', headers: { ...authHeaders, 'Content-Length': payload.length },
      }, eventData);
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    }

    // Delete event
    if (action === 'deleteEvent') {
      const r = await httpsRequest({ hostname: 'www.googleapis.com', path: `/calendar/v3/calendars/${calId}/events/${eventId}`, method: 'DELETE', headers: authHeaders });
      return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body || '{}' };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
