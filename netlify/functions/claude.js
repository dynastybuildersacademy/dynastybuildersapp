// Dynasty Builders Academy — Anthropic Claude API Proxy
// Uses Node https module — handles vision requests with extended timeout

const https = require('https');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function httpsPost(bodyStr, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(bodyStr, 'utf8');
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 55000, // 55s — just under Netlify's 60s limit
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Anthropic API timeout after 55s')); });
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in Netlify environment variables' }),
    };
  }

  try {
    // Netlify may base64-encode the body for large binary payloads
    let bodyStr = event.body || '{}';
    if (event.isBase64Encoded) {
      bodyStr = Buffer.from(bodyStr, 'base64').toString('utf8');
    }

    // Validate it's JSON before forwarding
    try { JSON.parse(bodyStr); } catch(e) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const result = await httpsPost(bodyStr, apiKey);

    return {
      statusCode: result.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: result.body,
    };
  } catch (err) {
    console.error('[Claude proxy error]', err.message);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
