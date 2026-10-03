// Dynasty Builders Academy — weekly schedule planner (pure logic, no DOM).
//
// Builds a suggested week of activities from the Perfect Week requirements
// (times a multiplier, 1.5x by default), the agent's goals, and a few
// recurring leader/client activities, then fits them into the agent's FREE
// time: it never lands on a blocked-out time, an existing appointment or
// another planned activity.
//
// Efficiency rules (what "efficient" means here):
//  1. Calls go in the best contact windows (late morning, early evening),
//     appointments in evenings and Saturday mornings, desk work early.
//  2. Similar work is batched; call blocks are capped at 90 minutes.
//  3. A 15-minute break separates any two activities.
//  4. Load is spread across the days you work, up to a daily maximum.
//  5. When time is short, EVERYTHING is scaled back evenly instead of
//     dropping whatever is last on the list.
//
// Hours rule (same as the Activity Log): 5 phone numbers = 1 hour,
// 25 calls = 1 hour, 1 appointment = 1 hour.
//
// All times are the agent's LOCAL time ('YYYY-MM-DD' dates, 'HH:MM' times).
const PLAN = (() => {
  const PW_BASE = { prospects: 25, calls: 250, ri: 10, appts: 6, fs: 4 };     // Perfect Week personal requirements
  const RULE = { prospectsPerHr: 5, callsPerHr: 25 };
  const BUF = 15, GRID = 15;
  const DEFAULTS = {
    multiplier: 1.5, dayStart: '08:00', dayEnd: '21:00', maxHoursPerDay: 9,
    workDays: [1, 2, 3, 4, 5, 6],                 // Monday = 1 … Sunday = 7
    annualReviews: 2, teamCalls: 1, leadershipCalls: null,   // null = by level
    followUpShare: 0.4, goalBlocks: 3, sundayReview: true,
  };
  const TYPES = {
    fs:        { label: 'Fast Start appointment slot', icon: '\ud83d\ude80', color: '#3498DB', cap: 3 },
    ri:        { label: 'Recruiting interview slot',   icon: '\ud83e\udd1d', color: '#C9A84C', cap: 3 },
    client:    { label: 'Client appointment slot',     icon: '\ud83d\udcbc', color: '#9B59B6', cap: 3 },
    followup:  { label: 'Prospect follow-up calls',    icon: '\ud83d\udcde', color: '#E67E22', cap: 3 },
    calls:     { label: 'Prospecting calls',           icon: '\u260e\ufe0f', color: '#D35400', cap: 3 },
    prospects: { label: 'Build your prospect list',    icon: '\ud83d\udcdd', color: '#16A085', cap: 2 },
    annual:    { label: 'Client annual review',        icon: '\ud83d\udccb', color: '#8E44AD', cap: 2 },
    team:      { label: 'Team-building call',          icon: '\ud83d\udc65', color: '#2ECC71', cap: 1 },
    leader:    { label: 'Leadership call',             icon: '\ud83c\udf96\ufe0f', color: '#1ABC9C', cap: 1 },
    goal:      { label: 'Goal focus',                  icon: '\ud83c\udfaf', color: '#C0392B', cap: 2 },
    planning:  { label: 'Plan the week',               icon: '\ud83d\uddd3\ufe0f', color: '#7F8C8D', cap: 1 },
    review:    { label: 'Weekly review',               icon: '\ud83d\udcca', color: '#7F8C8D', cap: 1 },
  };
  const CALLISH = new Set(['calls', 'followup']);
  // Order used when time runs short and two types are equally behind.
  const PRIORITY = ['fs', 'ri', 'client', 'followup', 'calls', 'prospects', 'goal'];
  const ANCHORS  = ['planning', 'review', 'team', 'leader', 'annual'];     // small and important: placed first

  // ── small helpers ───────────────────────────────────────────────
  const pad = n => String(n).padStart(2, '0');
  const mins = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
  const hhmm = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parseYmd(s); return ymd(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)); };
  const isoDow = s => (parseYmd(s).getDay() + 6) % 7 + 1;                 // Mon=1 … Sun=7
  const weekStartOf = s => addDays(s, -(isoDow(s) - 1));
  const ceilGrid = m => Math.ceil(m / GRID) * GRID;

  // ── time-of-day preference (0–100) ──────────────────────────────
  // [from, to, score] windows in minutes; first match wins; anything else scores 20.
  const H = h => h * 60;
  const WEEKDAY = {
    call:   [[H(10), H(12), 100], [H(16.5), H(20), 92], [H(9), H(10), 70], [H(13), H(16.5), 60], [H(12), H(13), 25]],
    appt:   [[H(17), H(20), 100], [H(15), H(17), 75], [H(10), H(15), 55], [H(20), H(21), 45]],
    annual: [[H(10), H(15), 100], [H(15), H(18), 70], [H(9), H(10), 55]],
    team:   [[H(18), H(20), 100], [H(12), H(13), 50]],
    leader: [[H(8), H(10), 100], [H(19), H(20), 70]],
    desk:   [[H(8), H(10), 100], [H(13), H(15), 70], [H(10), H(12), 55]],
  };
  const SATURDAY = { call: [[H(10), H(13), 80]], appt: [[H(9), H(13), 100], [H(13), H(16), 60]], annual: [[H(10), H(13), 60]], team: [[H(10), H(12), 60]], leader: [[H(9), H(11), 60]], desk: [[H(8), H(11), 70]] };
  const SUNDAY   = { call: [], appt: [[H(14), H(18), 40]], annual: [], team: [[H(16), H(19), 50]], leader: [[H(16), H(19), 50]], desk: [[H(17), H(20), 100]] };
  const FAMILY = { fs: 'appt', ri: 'appt', client: 'appt', followup: 'call', calls: 'call', annual: 'annual', team: 'team', leader: 'leader', prospects: 'desk', goal: 'desk', planning: 'desk', review: 'desk' };
  function pref(type, dow, start) {
    const table = dow === 7 ? SUNDAY : dow === 6 ? SATURDAY : WEEKDAY;
    const w = (table[FAMILY[type]] || []).find(([a, b]) => start >= a && start < b);
    let score = w ? w[2] : 20;
    if (type === 'planning' && dow === 1) score += 60;            // plan the week on Monday morning
    if (type === 'review' && dow === 7) score += 60;              // review on Sunday evening
    return score;
  }

  // ── what to schedule ───────────────────────────────────────────
  function chunk(totalMin, maxChunk = 90) {
    totalMin = Math.round(totalMin / GRID) * GRID; if (totalMin <= 0) return [];
    const n = Math.ceil(totalMin / maxChunk), each = Math.min(maxChunk, Math.ceil(totalMin / n / GRID) * GRID), out = [];
    for (let i = 0; i < n; i++) out.push(i < n - 1 ? each : totalMin - each * (n - 1));
    return out.filter(x => x > 0);
  }
  function buildDemand(settings, level, goals) {
    const m = settings.multiplier, ceil = x => Math.ceil(x - 1e-9);
    const d = {};
    const slot = (count, type, detail) => Array.from({ length: count }, () => ({ minutes: 60, title: TYPES[type].label, detail }));
    d.fs     = slot(ceil(PW_BASE.fs * m),    'fs',     'Hold this time for new-recruit Fast Starts.');
    d.ri     = slot(ceil(PW_BASE.ri * m),    'ri',     'Book recruiting interviews into this time.');
    d.client = slot(ceil(PW_BASE.appts * m), 'client', 'Hold this time for client appointments.');
    const totalCalls = ceil(PW_BASE.calls * m), callMin = Math.round(totalCalls / RULE.callsPerHr * 60 / GRID) * GRID;
    const followMin = Math.round(callMin * settings.followUpShare / GRID) * GRID;
    const sess = [...chunk(followMin).map(mn => ({ kind: 'followup', mn })), ...chunk(callMin - followMin).map(mn => ({ kind: 'calls', mn }))];
    const allMin = sess.reduce((n, x) => n + x.mn, 0), raw = sess.map(x => allMin ? x.mn / allMin * totalCalls : 0), fl = raw.map(Math.floor);
    let left = totalCalls - fl.reduce((n, x) => n + x, 0);                       // hand the leftover calls to the largest remainders
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, Math.max(0, left)).forEach(([, i]) => { fl[i]++; });
    d.followup = []; d.calls = [];
    sess.forEach((x, i) => {
      const n = fl[i], type = x.kind;
      d[type].push({ minutes: x.mn, calls: n, title: `${TYPES[type].label} \u00b7 about ${n} calls`,
        detail: type === 'followup' ? 'Work your follow-up list first: warm prospects, no-shows, and anyone you promised to call back.' : 'Call new names from your Top 25 and lists. Invite, set the appointment, move on.' });
    });
    const names = ceil(PW_BASE.prospects * m); d.prospects = [];
    for (let left = names; left > 0; left -= RULE.prospectsPerHr) {
      const n = Math.min(RULE.prospectsPerHr, left), mn = Math.ceil(n / RULE.prospectsPerHr * 60 / GRID) * GRID;
      d.prospects.push({ minutes: mn, names: n, title: `${TYPES.prospects.label} \u00b7 ${n} new names`, detail: `Add ${n} new names with phone numbers to your Top 25.` });
    }
    d.annual = Array.from({ length: Math.max(0, settings.annualReviews) }, () => ({ minutes: 45, title: TYPES.annual.label, detail: 'Review coverage, beneficiaries and referrals with one client.' }));
    d.team   = Array.from({ length: Math.max(0, settings.teamCalls) },     () => ({ minutes: 60, title: TYPES.team.label, detail: 'Connect with your team: wins, recognition, and what is next.' }));
    const leaders = settings.leadershipCalls == null ? (level >= 60 ? 2 : level >= 40 ? 1 : 0) : settings.leadershipCalls;
    d.leader = Array.from({ length: Math.max(0, leaders) }, () => ({ minutes: 60, title: TYPES.leader.label, detail: 'Develop your leaders: review their numbers and their next promotion step.' }));
    d.goal = (goals || []).slice(0, Math.max(0, settings.goalBlocks)).map(g => ({ minutes: 45, title: `Goal focus: ${String(g).slice(0, 60)}`, goalText: g, detail: 'Protected time to move this goal forward.' }));
    d.planning = [{ minutes: 30, title: TYPES.planning.label, detail: 'Set your targets, protect your calling blocks, review your goals.' }];
    d.review   = settings.sundayReview ? [{ minutes: 30, title: TYPES.review.label, detail: 'Compare the week to the Perfect Week, then set next week\u2019s goals.' }] : [];
    return d;
  }

  // ── free time ──────────────────────────────────────────────────
  function subtract(list, a, b) {
    const out = [];
    for (const [s, e] of list) {
      if (b <= s || a >= e) { out.push([s, e]); continue; }
      if (a > s) out.push([s, a]);
      if (b < e) out.push([b, e]);
    }
    return out;
  }
  function blockIntervals(blocks, date) {
    const dow = isoDow(date), out = [];
    for (const b of blocks || []) {
      const applies = b.kind === 'once' ? b.date === date : (b.days || []).includes(dow);
      if (!applies) continue;
      const a = b.allDay ? 0 : mins(b.start), z = b.allDay ? 1440 : mins(b.end);
      if (z > a) out.push([Math.max(0, a), Math.min(1440, z)]);          // overnight or empty blocks are ignored
    }
    return out;
  }

  // ── the planner ────────────────────────────────────────────────
  function suggestWeek(opts) {
    const settings = { ...DEFAULTS, ...(opts.settings || {}) };
    const now = opts.now || new Date(), todayS = ymd(now), nowMin = now.getHours() * 60 + now.getMinutes();
    const weekStart = weekStartOf(opts.weekStart), dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const level = opts.level || 0, planned = opts.planned || [], appts = opts.appointments || [];
    const demand = buildDemand(settings, level, opts.goals);
    if (todayS > weekStart) demand.planning = [];       // 'plan the week' only makes sense before the week has started

    // what is already planned this week reduces what still needs scheduling
    const have = {}; planned.filter(p => dates.includes(p.date)).forEach(p => { have[p.type] = (have[p.type] || 0) + 1; });
    for (const t of Object.keys(demand)) {
      if (t === 'goal') demand[t] = demand[t].filter(g => !planned.some(p => p.type === 'goal' && p.title === g.title && dates.includes(p.date)));
      else demand[t] = demand[t].slice(Math.min(have[t] || 0, demand[t].length));
    }

    const day = {};
    dates.forEach(date => {
      let free = date < todayS ? [] : [[mins(settings.dayStart), mins(settings.dayEnd)]];
      if (date === todayS) free = subtract(free, 0, ceilGrid(nowMin));
      blockIntervals(opts.blocks, date).forEach(([a, z]) => { free = subtract(free, a, z); });
      let hours = 0;
      appts.filter(a => a.date === date && a.time).forEach(a => { const t = mins(a.time); free = subtract(free, t - BUF, t + 60 + BUF); hours += 1; });
      planned.filter(p => p.date === date).forEach(p => { free = subtract(free, mins(p.start) - BUF, mins(p.end) + BUF); hours += (mins(p.end) - mins(p.start)) / 60; });
      day[date] = { free, hours, events: [], counts: {}, callish: 0 };
    });
    const freeHours = dates.filter(d => settings.workDays.includes(isoDow(d))).reduce((n, d) => n + Math.max(0, Math.min(day[d].free.reduce((a, [x, y]) => a + (y - x), 0) / 60, settings.maxHoursPerDay - day[d].hours)), 0);

    const events = [];
    function place(type, spec) {
      const T = TYPES[type], dur = spec.minutes, maxH = settings.maxHoursPerDay;
      const exempt = type === 'planning' || type === 'review';
      let best = null;
      for (const date of dates) {
        const D = day[date], dow = isoDow(date);
        const works = settings.workDays.includes(dow);
        if (type === 'review' ? dow !== 7 : !works) continue;                     // the weekly review is the one Sunday item
        if (!exempt && D.hours + dur / 60 > maxH + 1e-9) continue;
        if ((D.counts[type] || 0) >= T.cap) continue;
        if (CALLISH.has(type) && D.callish >= 3) continue;
        for (const [fs, fe] of D.free) {
          for (let s = ceilGrid(fs); s + dur <= fe; s += GRID) {
            let score = pref(type, dow, s) - D.hours * 6;
            if (D.events.some(e => e.type === type && (e.endMin + BUF === s || s + dur + BUF === e.startMin))) score += 12;   // batch like with like
            if (!best || score > best.score) best = { date, s, score };
          }
        }
      }
      if (!best) return false;
      const D = day[best.date];
      const ev = { id: `${best.date}T${hhmm(best.s)}-${type}`, date: best.date, start: hhmm(best.s), end: hhmm(best.s + dur), type, title: spec.title, detail: spec.detail || '', done: false, source: 'suggested', startMin: best.s, endMin: best.s + dur };
      D.events.push(ev); D.hours += dur / 60; D.counts[type] = (D.counts[type] || 0) + 1; if (CALLISH.has(type)) D.callish++;
      D.free = subtract(D.free, best.s - BUF, best.s + dur + BUF);
      events.push(ev); return true;
    }

    const shortfall = {}, need = {};
    for (const t of Object.keys(demand)) { need[t] = demand[t].length; shortfall[t] = 0; }
    ANCHORS.forEach(t => demand[t].forEach(spec => { if (!place(t, spec)) shortfall[t]++; }));

    // everything else shares the remaining time evenly: always advance the type that is furthest behind
    const queue = {}; PRIORITY.forEach(t => { queue[t] = { total: demand[t].length, placed: 0, next: 0, open: demand[t].length > 0 }; });
    for (;;) {
      const open = PRIORITY.filter(t => queue[t].open && queue[t].next < queue[t].total);
      if (!open.length) break;
      open.sort((a, b) => queue[a].placed / queue[a].total - queue[b].placed / queue[b].total || PRIORITY.indexOf(a) - PRIORITY.indexOf(b));
      const t = open[0], q = queue[t];
      if (place(t, demand[t][q.next])) { q.placed++; q.next++; }
      else { q.open = false; }                                                  // no room left for this type
    }
    PRIORITY.forEach(t => { shortfall[t] += queue[t].total - queue[t].placed; });

    events.sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin);
    const out = events.map(({ startMin, endMin, ...e }) => e);
    const sum = arr => arr.reduce((n, s) => n + s.minutes, 0) / 60;
    const needHours = Object.values(demand).reduce((n, a) => n + sum(a), 0);
    const placedHours = out.reduce((n, e) => n + (mins(e.end) - mins(e.start)) / 60, 0);
    const byType = Object.keys(demand).filter(t => need[t] > 0).map(t => ({ type: t, label: TYPES[t].label, icon: TYPES[t].icon, needed: need[t], placed: need[t] - shortfall[t], short: shortfall[t] }));
    return { weekStart, events: out, summary: { needHours, placedHours, freeHours, byType, perDay: dates.map(d => ({ date: d, hours: out.filter(e => e.date === d).reduce((n, e) => n + (mins(e.end) - mins(e.start)) / 60, 0) })), unplaced: byType.reduce((n, r) => n + r.short, 0) } };
  }

  // The highest multiplier (down to 0.5, in 0.05 steps) at which everything fits in the free time.
  function maxMultiplierThatFits(opts) {
    const start = (opts.settings && opts.settings.multiplier) || DEFAULTS.multiplier;
    for (let m = Math.round(start * 20) / 20; m >= 0.5 - 1e-9; m = Math.round((m - 0.05) * 20) / 20) {
      const r = suggestWeek({ ...opts, settings: { ...(opts.settings || {}), multiplier: m } });
      if (r.summary.unplaced === 0) return m;
    }
    return null;
  }

  // ── calendar file for Apple / Google / Outlook ─────────────────
  const esc = s => String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  function fold(line) {                                  // RFC 5545: lines longer than 75 octets are folded
    const enc = new TextEncoder(); if (enc.encode(line).length <= 75) return line;
    const out = []; let cur = '', bytes = 0, limit = 75;
    for (const ch of line) {
      const b = enc.encode(ch).length;
      if (bytes + b > limit) { out.push(cur); cur = ' '; bytes = 1; limit = 75; }
      cur += ch; bytes += b;
    }
    out.push(cur); return out.join('\r\n');
  }
  function toICS(events, o = {}) {
    const now = o.now || new Date(), stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
    const dt = (date, t) => `${date.replace(/-/g, '')}T${t.replace(':', '')}00`;       // floating local time: lands at the same wall-clock time on any phone
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dynasty Builders Academy//Schedule//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${esc(o.name || 'DBA Schedule')}`];
    events.forEach(e => {
      const T = TYPES[e.type] || {};
      L.push('BEGIN:VEVENT', `UID:${esc(e.id)}@dba-portal`, `DTSTAMP:${stamp}`, `DTSTART:${dt(e.date, e.start)}`, `DTEND:${dt(e.date, e.end)}`,
        `SUMMARY:${esc((T.icon ? T.icon + ' ' : '') + e.title)}`, `DESCRIPTION:${esc(e.detail || '')}`, `CATEGORIES:${esc(T.label || 'DBA')}`,
        'BEGIN:VALARM', `TRIGGER:-PT${o.alarmMin == null ? 10 : o.alarmMin}M`, 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)}`, 'END:VALARM', 'END:VEVENT');
    });
    L.push('END:VCALENDAR');
    return L.map(fold).join('\r\n') + '\r\n';
  }

  return { PW_BASE, DEFAULTS, TYPES, PRIORITY, ymd, parseYmd, addDays, isoDow, weekStartOf, mins, hhmm, pref, buildDemand, blockIntervals, suggestWeek, maxMultiplierThatFits, toICS };
})();
if (typeof module !== 'undefined') module.exports = PLAN;
