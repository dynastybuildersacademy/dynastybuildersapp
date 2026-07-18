// DBA — Anthropic AI proxy (keeps API key server-side)

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          ANTHROPIC_KEY,
        'anthropic-version':  '2023-06-01',
      },
      body: JSON.stringify({
        model:      body.model      || 'claude-sonnet-4-6',
        max_tokens: body.max_tokens || 1000,
        system:     body.system     || '',
        messages:   body.messages   || [],
      }),
    });

    const text = await response.text();
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: text };
  } catch (err) {
    return { statusCode: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: err.message } }) };
  }
};
