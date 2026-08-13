// Dynasty Builders Academy — Monday.com API Proxy
// Bypasses browser CORS restrictions by proxying from Netlify's server

const ORG_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY1Nzg0OTc3NSwiYWFpIjoxMSwidWlkIjo2MTY2MDI5NCwiaWFkIjoiMjAyNi0wNS0xM1QwOTo0OTowNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM3NjI1MTMsInJnbiI6InVzZTEifQ.eCbOAEJTC3mcsit4IjVWOw3r2wyQBYL4lN5Qmnok0r0';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-monday-key',
};

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { query, variables } = body;

    // Key priority:
    // 1. Passed in request body (most reliable — avoids header stripping)
    // 2. Authorization header (lowercase — Netlify normalizes headers)
    // 3. x-monday-key custom header
    // 4. Environment variable set in Netlify dashboard
    // 5. Hardcoded org key (always works)
    const apiKey =
      body.apiKey ||
      event.headers['authorization'] ||
      event.headers['x-monday-key'] ||
      process.env.MONDAY_API_KEY ||
      ORG_KEY;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        'API-Version': '2024-01',
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ errors: [{ message: err.message }] }),
    };
  }
};
