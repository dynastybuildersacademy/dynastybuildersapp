// DBA — OpenAI proxy (keeps API key server-side, avoids CORS)

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

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
    const endpoint = body.endpoint || 'images/generations';

    const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + OPENAI_KEY,
      },
      body: JSON.stringify(body.payload || body),
    });

    const text = await response.text();
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: text };
  } catch (err) {
    return { statusCode: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: err.message } }) };
  }
};
