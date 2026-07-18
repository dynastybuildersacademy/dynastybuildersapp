// DBA — Monday.com proxy function
// Bypasses CORS by proxying API calls server-side

const MONDAY_API_KEY = process.env.MONDAY_API_KEY || '';  // Set in Netlify env vars

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  try {
    const { query, variables } = JSON.parse(event.body || '{}');

    // Use header key if provided, otherwise fall back to built-in key
    const apiKey = (event.headers['authorization'] || '').replace(/^Bearer\s+/i, '')
      || MONDAY_API_KEY;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': apiKey,
        'API-Version':   '2024-01',
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: text,
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ errors: [{ message: err.message }] }),
    };
  }
};
