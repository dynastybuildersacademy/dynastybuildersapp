// Dynasty Builders Academy — Automation Trigger Hub
// Fires Zapier webhooks for configured sequences.
// Each trigger type maps to a Zapier Catch Hook URL stored in env vars.
//
// ENV VARS (set in Netlify):
//   ZAPIER_BOM_GUEST       → fires when BOM guest is added
//   ZAPIER_TOP25_PROSPECT  → fires when Top 25 prospect is added
//   ZAPIER_SURVEY_LEAD     → fires when survey/brochure lead submits
//   ZAPIER_NEW_AGENT       → fires when new agent is added to roster
//   ZAPIER_FAST_START      → fires for Fast Start onboarding milestone
//   ZAPIER_LICENSING       → fires for licensing stage changes
//   ZAPIER_FIRST_CHECK     → fires when first commission check recorded
//   ZAPIER_PROMOTION       → fires on promotion level change
//   ZAPIER_ATTENDANCE      → fires when agent attends/misses training
//   ZAPIER_GLOBAL          → fallback — fires for all events if specific hook not set

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// Map trigger types to env var names
const HOOK_MAP = {
  bom_guest:       'ZAPIER_BOM_GUEST',
  top25_prospect:  'ZAPIER_TOP25_PROSPECT',
  survey_lead:     'ZAPIER_SURVEY_LEAD',
  new_agent:       'ZAPIER_NEW_AGENT',
  fast_start:      'ZAPIER_FAST_START',
  licensing:       'ZAPIER_LICENSING',
  first_check:     'ZAPIER_FIRST_CHECK',
  promotion:       'ZAPIER_PROMOTION',
  attendance:      'ZAPIER_ATTENDANCE',
};

async function fireWebhook(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { status: res.status, ok: res.ok };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const { trigger, data, agentId, agentName, timestamp } = body;

    if (!trigger) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing trigger type' }) };

    const envKey  = HOOK_MAP[trigger];
    const hookUrl = envKey ? process.env[envKey] : null;
    const globalUrl = process.env['ZAPIER_GLOBAL'];

    if (!hookUrl && !globalUrl) {
      return {
        statusCode: 200, headers: CORS,
        body: JSON.stringify({ fired: false, reason: `No webhook configured for trigger: ${trigger}. Set ${envKey || 'ZAPIER_GLOBAL'} in Netlify env vars.` })
      };
    }

    // Build standardized payload
    const payload = {
      trigger,
      timestamp: timestamp || new Date().toISOString(),
      agentId:   agentId || '',
      agentName: agentName || '',
      source:    'DBA Agent Portal',
      data:      data || {},
    };

    const results = [];

    // Fire specific hook
    if (hookUrl) {
      try {
        const r = await fireWebhook(hookUrl, payload);
        results.push({ hook: envKey, status: r.status, ok: r.ok });
      } catch(e) {
        results.push({ hook: envKey, error: e.message });
      }
    }

    // Also fire global hook if configured (useful for logging)
    if (globalUrl && globalUrl !== hookUrl) {
      try {
        const r = await fireWebhook(globalUrl, payload);
        results.push({ hook: 'ZAPIER_GLOBAL', status: r.status, ok: r.ok });
      } catch(e) {
        results.push({ hook: 'ZAPIER_GLOBAL', error: e.message });
      }
    }

    return {
      statusCode: 200, headers: CORS,
      body: JSON.stringify({ fired: true, trigger, results })
    };

  } catch(e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
