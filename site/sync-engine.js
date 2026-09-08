// Dynasty Builders Academy — Auto-Sync Engine
// Shared by licensing.html, bom.html, top25.html
// Auto-syncs data to Monday.com on every save, with retry queue

const DBA_SYNC = (() => {
  const QUEUE_KEY = 'dba_sync_queue';
  const MAX_QUEUE = 50;
  const MAX_RETRIES = 3;

  // ── RETRY QUEUE ──────────────────────────────────────────────
  function getQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
  }
  function saveQueue(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE))); } catch {}
  }
  function enqueue(item) {
    const q = getQueue();
    // Deduplicate by key — replace existing pending sync for same item
    const idx = q.findIndex(i => i.key === item.key);
    if (idx >= 0) q.splice(idx, 1);
    q.push({ ...item, addedAt: Date.now(), retries: 0 });
    saveQueue(q);
  }
  function dequeue(key) {
    const q = getQueue().filter(i => i.key !== key);
    saveQueue(q);
  }
  function markFailed(key) {
    const q = getQueue();
    const item = q.find(i => i.key === key);
    if (item) {
      item.retries = (item.retries || 0) + 1;
      if (item.retries >= MAX_RETRIES) {
        console.warn('[DBA Sync] Max retries exceeded for', key, '— dropping');
        saveQueue(q.filter(i => i.key !== key));
      } else {
        saveQueue(q);
      }
    }
  }

  // ── BACKGROUND SYNC ──────────────────────────────────────────
  // Non-blocking: fires after save, doesn't block UI
  async function background(fn, key, label) {
    enqueue({ key, label, fn: fn.toString() }); // queue for retry
    try {
      await fn();
      dequeue(key); // success — remove from queue
    } catch(e) {
      markFailed(key);
      console.warn('[DBA Sync] Background sync failed:', label, e.message);
    }
  }

  // ── FLUSH QUEUE ON LOAD ──────────────────────────────────────
  // Call this on page load to retry any failed syncs
  async function flushQueue(syncFn) {
    const q = getQueue();
    if (!q.length) return;
    if (!AUTH.getMondayKey()) return;
    console.log('[DBA Sync] Flushing', q.length, 'queued syncs');
    for (const item of q) {
      try {
        await syncFn(item);
        dequeue(item.key);
      } catch(e) {
        markFailed(item.key);
      }
    }
  }

  // ── TOAST (non-blocking status) ──────────────────────────────
  function status(msg, isError) {
    const el = document.getElementById('sync-status-bar');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#E74C3C' : '#2DCA73';
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 3000);
  }

  return { background, enqueue, dequeue, flushQueue, status, getQueue };
})();
