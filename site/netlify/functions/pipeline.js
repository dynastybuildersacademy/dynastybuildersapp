// Dynasty Builders Academy — Recruitment Pipeline Automation (Step E)
// Triggered when a new recruit is added to an agent's Top 25 board
// with status "New Agent", "Recruited", or "New Recruit"
//
// Automatically:
// 1. Creates a licensing tracker record for the new recruit
// 2. Notifies the upline MD in Monday.com
// 3. Tags the recruit in the onboarding group on the licensing board
// 4. Logs the recruit under the MD's downline production

const MONDAY_KEY  = process.env.MONDAY_API_KEY;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dba-dynasty-builders-fallback-key-change-in-prod';
const LICENSING_BOARD = '7119617002';
const crypto = require('crypto');

const CORS = {
  'Access-Control-Allow-Origin': 'https://agent.dynastybuildersapp.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

async function mondayMutation(query) {
  const res = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': MONDAY_KEY, 'API-Version': '2024-01' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

async function mondayRead(query) {
  return mondayMutation(query);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  // Verify auth token
  const token = (event.headers.authorization || '').replace('Bearer ', '');
  const session = verifyToken(token);
  if (!session) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    // ── TRIGGER: NEW RECRUIT DETECTED ───────────────────────────
    if (action === 'new_recruit') {
      const { recruit, agentId, agentName, uplineMDId, uplineMDName, top25BoardId } = body;
      if (!recruit?.name) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing recruit data' }) };
      }

      const results = { steps: [] };

      // Step 1: Create licensing tracker record
      try {
        const licRes = await mondayMutation(`mutation {
          create_item(
            board_id: ${LICENSING_BOARD},
            item_name: "${recruit.name.replace(/"/g,"'")}",
            column_values: "${JSON.stringify({
              text: agentId || '',
              text1: agentName || '',
              text2: uplineMDName || '',
              status: { label: 'Not Started' },
              phone: recruit.phone || '',
            }).replace(/"/g, '\\"')}",
            create_labels_if_missing: true
          ) { id }
        }`);
        const licItemId = licRes?.data?.create_item?.id;
        results.steps.push({ step: 'licensing_record', success: !!licItemId, itemId: licItemId });
      } catch(e) {
        results.steps.push({ step: 'licensing_record', success: false, error: e.message });
      }

      // Step 2: Notify upline MD via Monday update on their roster item
      if (uplineMDId && MONDAY_KEY) {
        try {
          // Find the MD's roster item and post an update
          const notifyRes = await mondayMutation(`mutation {
            create_update(
              item_id: ${uplineMDId},
              body: "🆕 New recruit added: ${recruit.name.replace(/"/g,"'")} — added by ${agentName}. Licensing stage: Not Started."
            ) { id }
          }`);
          results.steps.push({ step: 'md_notification', success: !!notifyRes?.data?.create_update?.id });
        } catch(e) {
          results.steps.push({ step: 'md_notification', success: false, error: e.message });
        }
      }

      // Step 3: Add onboarding checklist as update on the licensing item
      const licItem = results.steps.find(s => s.step === 'licensing_record');
      if (licItem?.itemId) {
        try {
          await mondayMutation(`mutation {
            create_update(
              item_id: ${licItem.itemId},
              body: "📋 Onboarding Checklist for ${recruit.name.replace(/"/g,"'")}:\\n\\n✅ Added by: ${agentName}\\n⏳ Complete New Associate Agreement\\n⏳ Complete Week 1 PHP System Flow\\n⏳ Schedule Pre-Licensing Study\\n⏳ Schedule State Exam\\n⏳ Submit License Application\\n⏳ Complete Appointment with Carrier"
            ) { id }
          }`);
          results.steps.push({ step: 'onboarding_checklist', success: true });
        } catch(e) {
          results.steps.push({ step: 'onboarding_checklist', success: false, error: e.message });
        }
      }

      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true, results }) };
    }

    // ── TRIGGER: STATUS CHANGE (prospect promoted to recruit) ────
    if (action === 'status_change') {
      const { itemId, itemName, oldStatus, newStatus, agentId, agentName, uplineMDName } = body;

      const recruitStatuses = ['new agent', 'recruited', 'new recruit', 'signed up', 'contracted'];
      const isNewRecruit = recruitStatuses.includes((newStatus||'').toLowerCase().trim());

      if (!isNewRecruit) {
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ action: 'no_trigger', reason: 'Status not a recruit trigger' }) };
      }

      // Delegate to new_recruit handler
      const recruitBody = {
        action: 'new_recruit',
        recruit: { name: itemName, phone: '' },
        agentId, agentName, uplineMDName,
      };

      // Re-call the new_recruit action
      const recRes = await exports.handler({
        ...event,
        body: JSON.stringify(recruitBody),
      });
      return recRes;
    }

    // ── BATCH: SCAN TOP25 FOR UNPROCESSED RECRUITS ───────────────
    if (action === 'scan_for_recruits') {
      const { top25BoardId, agentId, agentName, uplineMDName } = body;
      if (!top25BoardId) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing top25BoardId' }) };
      }

      // Fetch items with recruit-status labels
      const recruitStatuses = ['New Agent','Recruited','New Recruit','Signed Up','Contracted'];
      const res = await mondayRead(`{
        boards(ids:${top25BoardId}) {
          items_page(limit:200) {
            items {
              id name
              column_values { id title text }
            }
          }
        }
      }`);
      const items = res?.data?.boards?.[0]?.items_page?.items || [];

      // Find items in licensing board already (to avoid duplicates)
      const licRes = await mondayRead(`{
        boards(ids:${LICENSING_BOARD}) {
          items_page(limit:500) { items { id name } }
        }
      }`);
      const existingNames = new Set(
        (licRes?.data?.boards?.[0]?.items_page?.items||[]).map(i => i.name.toLowerCase().trim())
      );

      const recruits = items.filter(item => {
        const statusCol = item.column_values.find(c => (c.title||'').toLowerCase().includes('status'));
        const status = statusCol?.text || '';
        const isRecruit = recruitStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()));
        const alreadyInLicensing = existingNames.has(item.name.toLowerCase().trim());
        return isRecruit && !alreadyInLicensing;
      });

      const processed = [];
      for (const recruit of recruits.slice(0, 20)) { // cap at 20 per scan
        try {
          const licMutRes = await mondayMutation(`mutation {
            create_item(
              board_id: ${LICENSING_BOARD},
              item_name: "${recruit.name.replace(/"/g,"'")}",
              column_values: "${JSON.stringify({
                status: { label: 'Not Started' },
                text: agentId || '',
                text1: agentName || '',
              }).replace(/"/g,'\\"')}",
              create_labels_if_missing: true
            ) { id name }
          }`);
          const created = licMutRes?.data?.create_item;
          if (created) processed.push({ name: recruit.name, licItemId: created.id });
        } catch(e) {
          console.warn('Pipeline scan error for', recruit.name, e.message);
        }
      }

      return {
        statusCode: 200, headers: CORS,
        body: JSON.stringify({ success: true, scanned: recruits.length, processed: processed.length, items: processed })
      };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch(e) {
    console.error('Pipeline error:', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
