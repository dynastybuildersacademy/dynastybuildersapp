// Dynasty Builders Academy — Monday.com API Proxy
// Uses Node https module (no fetch dependency — works on all Netlify runtimes)

const https = require('https');

const ORG_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY1Nzg0OTc3NSwiYWFpIjoxMSwidWlkIjo2MTY2MDI5NCwiaWFkIjoiMjAyNi0wNS0xM1QwOTo0OTowNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM3NjI1MTMsInJnbiI6InVzZTEifQ.eCbOAEJTC3mcsit4IjVWOw3r2wyQBYL4lN5Qmnok0r0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-monday-key',
};

function httpsPost(body, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(body, 'utf8');
    const req = https.request({
      hostname: 'api.monday.com',
      path: '/v2',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
        'Authorization': apiKey,
        'API-Version': '2024-01',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { query, variables } = body;

    // Always use the org key — agents don't have individual keys
    // env var takes priority so key can be rotated without redeploy
    const apiKey = process.env.MONDAY_API_KEY || ORG_KEY;

    const result = await httpsPost(
      JSON.stringify({ query, variables: variables || {} }),
      apiKey
    );

    return {
      statusCode: result.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: result.body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ errors: [{ message: err.message }] }),
    };
  }
};
