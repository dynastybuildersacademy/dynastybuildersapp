// Dynasty Builders Academy — shared date-range filter (presets + custom from/to).
// One control and one set of rules for every screen that filters by date
// (Top 25 date entered / appointment date, BOM guests, captain leaderboard,
// captain income, recruiting schedule), so "Last 7 days" or "This month"
// mean the same thing everywhere.
//
// All dates are LOCAL calendar days as 'YYYY-MM-DD'. "Last N days" counts N
// days including today. Ranges are inclusive on both ends; an empty `from`
// or `to` is open-ended. Timestamps (like Monday's created_at) are converted
// to the viewer's local day before comparing.
const DR = (() => {
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const day = (d, add = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + add);

  const LABELS = {
    all: 'All time', today: 'Today', yesterday: 'Yesterday',
    last7: 'Last 7 days', last14: 'Last 14 days', last30: 'Last 30 days', last90: 'Last 90 days',
    month: 'This month', lastmonth: 'Last month', year: 'This year',
    next7: 'Next 7 days', next30: 'Next 30 days', upcoming: 'Upcoming (from today)',
    custom: 'Custom range…',
  };

  function resolve(preset, from = '', to = '', now = new Date()) {
    const t = day(now);
    const first = (y, m) => new Date(y, m, 1), last = (y, m) => new Date(y, m + 1, 0);
    if (/^\d+$/.test(String(preset))) preset = 'last' + preset;          // legacy '7' / '30' / '90'
    switch (preset) {
      case 'today':     return { from: ymd(t), to: ymd(t) };
      case 'yesterday': return { from: ymd(day(t, -1)), to: ymd(day(t, -1)) };
      case 'last7': case 'last14': case 'last30': case 'last90': {
        const n = parseInt(preset.slice(4), 10); return { from: ymd(day(t, -(n - 1))), to: ymd(t) };
      }
      case 'month':     return { from: ymd(first(t.getFullYear(), t.getMonth())), to: ymd(last(t.getFullYear(), t.getMonth())) };
      case 'lastmonth': return { from: ymd(first(t.getFullYear(), t.getMonth() - 1)), to: ymd(last(t.getFullYear(), t.getMonth() - 1)) };
      case 'year':      return { from: `${t.getFullYear()}-01-01`, to: `${t.getFullYear()}-12-31` };
      case 'next7':     return { from: ymd(t), to: ymd(day(t, 6)) };
      case 'next30':    return { from: ymd(t), to: ymd(day(t, 29)) };
      case 'upcoming':  return { from: ymd(t), to: '' };
      case 'custom': {
        let f = from || '', u = to || '';
        if (f && u && f > u) [f, u] = [u, f];                              // picked backwards: swap
        return { from: f, to: u };
      }
      default: return { from: '', to: '' };                                // 'all'
    }
  }

  // Any date-ish value → local 'YYYY-MM-DD' ('' when it can't be read).
  function localDate(v) {
    if (!v) return '';
    const s = String(v).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{4}-\d{2}-\d{2} /.test(s)) return s.slice(0, 10);              // Monday date + time column
    const d = new Date(s);
    return isNaN(d) ? '' : ymd(d);                                         // ISO timestamp → viewer's local day
  }

  const isActive = r => !!(r && (r.from || r.to));
  // Undated values can't be placed in a range, so they only pass when asked to.
  function inRange(v, r, includeUndated = false) {
    if (!isActive(r)) return true;
    const d = localDate(v);
    if (!d) return includeUndated;
    return (!r.from || d >= r.from) && (!r.to || d <= r.to);
  }

  function describe(r) {
    if (!isActive(r)) return 'all dates';
    const f = s => new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (r.from && r.to) return r.from === r.to ? f(r.from) : `${f(r.from)} – ${f(r.to)}`;
    return r.from ? `from ${f(r.from)}` : `through ${f(r.to)}`;
  }

  // Builds [preset dropdown][from – to inputs when Custom] inside `host`.
  // opts: presets[], value, labels{}, onChange(range, state), selectClass, inputClass, selectStyle, inputStyle, ariaLabel
  function mount(host, opts = {}) {
    const presets = opts.presets || ['all', 'last7', 'last30', 'month', 'custom'];
    const labels = { ...LABELS, ...(opts.labels || {}) };
    const st = { preset: opts.value || presets[0], from: '', to: '' };
    host.innerHTML =
      `<select data-dr="preset" class="${opts.selectClass || ''}" style="${opts.selectStyle || ''}" aria-label="${opts.ariaLabel || 'Date range'}">` +
        presets.map(p => `<option value="${p}">${labels[p] || p}</option>`).join('') + `</select>` +
      `<span data-dr="custom" style="display:none;align-items:center;gap:5px;">` +
        `<input type="date" data-dr="from" class="${opts.inputClass || ''}" style="${opts.inputStyle || ''}" aria-label="From date">` +
        `<span style="font-size:11px;opacity:.7;">to</span>` +
        `<input type="date" data-dr="to" class="${opts.inputClass || ''}" style="${opts.inputStyle || ''}" aria-label="To date"></span>`;
    const $ = k => host.querySelector(`[data-dr="${k}"]`);
    const range = () => resolve(st.preset, st.from, st.to);
    const sync = () => { $('preset').value = st.preset; $('from').value = st.from; $('to').value = st.to; $('custom').style.display = st.preset === 'custom' ? 'inline-flex' : 'none'; };
    const fire = () => { if (opts.onChange) opts.onChange(range(), { ...st }); };
    $('preset').addEventListener('change', e => { st.preset = e.target.value; sync(); fire(); });
    $('from').addEventListener('change', e => { st.from = e.target.value; fire(); });
    $('to').addEventListener('change',   e => { st.to = e.target.value; fire(); });
    sync();
    return {
      range, state: () => ({ ...st }),
      set(preset, from = '', to = '', silent = false) { st.preset = preset; st.from = from; st.to = to; sync(); if (!silent) fire(); },
    };
  }

  return { ymd, resolve, localDate, isActive, inRange, describe, mount, LABELS };
})();
if (typeof module !== 'undefined') module.exports = DR;
