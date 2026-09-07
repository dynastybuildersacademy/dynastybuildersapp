// Dynasty Builders Academy — Public config endpoint
// Exposes non-secret env vars to the browser safely

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' },
    body: JSON.stringify({
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    }),
  };
};
