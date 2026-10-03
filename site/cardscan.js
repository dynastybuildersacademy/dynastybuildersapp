// Dynasty Builders Academy — business card scanner.
//
//  parseCard(text | {lines})  turns the text read from a card into prospect fields. Pure logic, no DOM.
//  scan(file, opts)           (browser) prepares the photo, reads it ON THE DEVICE with Tesseract.js, and parses it.
//
// Nothing is uploaded: the photo never leaves the phone. The OCR engine and English data are served from
// /ocr/ on this site (about 7 MB, downloaded the first time someone scans, then cached).
//
// OCR is never perfect, so the parser expects mistakes (stray marks, a misread digit) and the screen that
// uses it always shows every field for the agent to check before anything is saved.
const CARDSCAN = (() => {
  // ── word lists ─────────────────────────────────────────────────
  const TITLE_WORDS = ['agent', 'manager', 'director', 'owner', 'ceo', 'cfo', 'coo', 'cto', 'cmo', 'president', 'vp', 'broker', 'realtor', 'consultant',
    'specialist', 'advisor', 'adviser', 'associate', 'founder', 'co-founder', 'partner', 'attorney', 'lawyer', 'cpa', 'accountant', 'officer', 'executive',
    'representative', 'rep', 'analyst', 'planner', 'coordinator', 'supervisor', 'principal', 'chairman', 'recruiter', 'developer', 'engineer', 'designer',
    'photographer', 'therapist', 'coach', 'trainer', 'dentist', 'physician', 'doctor', 'nurse', 'pastor', 'minister', 'banker', 'underwriter', 'adjuster',
    'estimator', 'stylist', 'instructor', 'teacher', 'professor', 'contractor', 'technician', 'assistant', 'administrator', 'strategist', 'educator', 'mentor', 'preparer', 'processor', 'closer',
    'agente', 'gerente', 'abogado', 'abogada', 'corredor', 'asesor', 'asesora', 'consultor', 'consultora', 'propietario', 'propietaria', 'presidente', 'fundador', 'fundadora', 'representante', 'especialista', 'contador', 'contadora'];
  const LEGAL = ['llc', 'inc', 'corp', 'corporation', 'ltd', 'llp', 'lp', 'pllc', 'co', 'holdings', 'enterprises', 'ventures', 'incorporated', 'limited'];
  const COMPANY_STRONG = ['llc', 'inc', 'corp', 'corporation', 'co', 'ltd', 'llp', 'lp', 'pllc', 'pc', 'group', 'partners', 'associates', 'agency', 'company',
    'enterprises', 'holdings', 'international', 'foundation', 'ventures', 'firm', 'studio', 'clinic', 'center', 'centre', 'institute', 'bank', 'union'];
  const COMPANY_WEAK = ['financial', 'insurance', 'realty', 'real estate', 'services', 'solutions', 'mortgage', 'wealth', 'capital', 'consulting', 'properties',
    'investments', 'advisors', 'advisory', 'benefits', 'lending', 'loans', 'homes', 'law', 'dental', 'medical', 'health', 'marketing', 'media', 'design', 'tax', 'accounting', 'security'];
  const SMALL_OK = new Set(['jr', 'sr', 'ii', 'iv', 'pc', 'md', 'do', 'dc', 'pa', 'co', 'dr', 'mr', 'ms', 'vp', 'st', 'rd', 'ln', 'ct', 'pl', 'de', 'da', 'di', 'la', 'le', 'al', 'el', 'bi', 'ng', 'lo', 'yu', 'wu', 'xu', 'li', 'ho', 'ko', 'oh', 'or', 'of', 'at', 'in', 'on', 'my', 'we', 'us', 'it', 'is', 'to', 'by', 'an', 'as']);
  const PARTICLES = new Set(['de', 'del', 'della', 'di', 'da', 'van', 'von', 'der', 'den', 'la', 'le', 'bin', 'al', 'el', 'dos', 'das', 'du', 'st', 'st.', 'mc', 'mac']);
  const STATES = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR'.split(' ');
  const STREET = 'st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|ln|lane|way|ct|court|pkwy|parkway|hwy|highway|pl|place|cir|circle|trl|trail|sq|square|terrace|ter|plaza|loop|pike|row';
  const CRED = /\b(cfp|chfc|clu|lutcf|cpa|mba|esq|phd|md|dds|pmp|crpc|cfa|cic|rhu|reba|abr|crs|gri|sres|pc|jd|rn|llm|msw|licsw|lpc|dc|od|dvm)\b/i;

  const wordRe = w => new RegExp('(^|[^a-z0-9])' + w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '($|[^a-z0-9])', 'i');
  const TITLE_RES = TITLE_WORDS.map(wordRe), STRONG_RES = COMPANY_STRONG.map(wordRe), WEAK_RES = COMPANY_WEAK.map(wordRe), LEGAL_RES = LEGAL.map(wordRe);
  const hits = (res, s) => res.reduce((n, r) => n + (r.test(s) ? 1 : 0), 0);

  // ── small helpers ──────────────────────────────────────────────
  const clean = s => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/[\u2022\u00b7\u25cf\u25aa\u2756\u2709\u260e\u260f\u2706\u2302\u2616\u2606\u2605\u2192\u00bb\u00ab\u2014\u2013]+/g, ' ').replace(/\s+/g, ' ').trim();
  function stripNoise(s) {                          // OCR leaves stray marks and 1-2 character crumbs at line ends
    let t = s.replace(/^[^A-Za-z0-9(+@#]+/, '').replace(/[~_=]+/g, ' ').replace(/\s*\|\s*(?=\||$)/g, ' ').replace(/\s+/g, ' ').trim();
    let parts = t.split(' ');
    while (parts.length > 1) {
      const last = parts[parts.length - 1], bare = last.replace(/[^A-Za-z0-9]/g, '');
      const junk = !/[A-Za-z0-9]/.test(last) || (bare.length <= 2 && !SMALL_OK.has(bare.toLowerCase()) && !/[.)]$/.test(last) && parts.length >= 3 || (bare.length <= 2 && /^\d+$/.test(bare)) || (bare.length === 1 && !/[AIa]/.test(bare)) && !/[.,]$/.test(last));
      if (junk) parts.pop(); else break;
    }
    return parts.join(' ').replace(/[\s,;:\-–]+$/, '').trim();
  }
  const titleCase = n => n.split(' ').map(w => {
    if (/^(mc)([a-z]+)$/i.test(w) && w === w.toUpperCase()) return 'Mc' + w.slice(2, 3).toUpperCase() + w.slice(3).toLowerCase();
    return w.split('-').map(h => h.split("'").map(p => p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p).join("'")).join('-');
  }).join(' ');
  const isShouting = s => /[A-Za-z]/.test(s) && s === s.toUpperCase();
  const digitsOf = s => String(s || '').replace(/\D/g, '');
  function formatPhone(d) { d = digitsOf(d); if (d.length === 11 && d[0] === '1') d = d.slice(1); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d; }

  // ── lines in, with sizes when the OCR engine reports them ──────
  function toLines(input) {
    let arr;
    if (typeof input === 'string') arr = input.split(/\r?\n/).map(t => ({ text: t }));
    else if (input && Array.isArray(input.lines)) arr = input.lines.map(l => (typeof l === 'string' ? { text: l } : l));
    else arr = [];
    arr = arr.map((l, i) => ({ raw: clean(l.text), h: Number(l.h || l.height) || 0, conf: l.conf == null ? 100 : l.conf, i })).filter(l => /[A-Za-z0-9@]/.test(l.raw));
    const hs = arr.map(l => l.h).filter(Boolean).sort((a, b) => a - b), med = hs.length ? hs[Math.floor(hs.length / 2)] : 0;
    arr.forEach(l => { l.rel = med && l.h ? l.h / med : 1; });
    return arr;
  }

  // ── the parser ─────────────────────────────────────────────────
  function parseCard(input) {
    const lines = toLines(input);
    const used = new Set(), out = { name: '', title: '', company: '', phones: [], phone: '', email: '', website: '', address: '', credentials: '', other: [], flags: {} };
    const take = (l, text) => { l.rest = text; };
    lines.forEach(l => { l.rest = l.raw; });

    // 1. email (tolerates spaces around @ and a comma where the dot should be). Any other text on the same
    //    line (two-column cards are often read as one merged line) is kept for the name / title / company.
    for (const l of lines) {
      const pre = l.rest.replace(/\(at\)/ig, '@').replace(/\s*@\s*/g, '@');
      const m = pre.match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\s*[.,]\s*[A-Za-z0-9\-]+)+/);
      if (!m) continue;
      const email = m[0].replace(/\s+/g, '').replace(/,(?=[A-Za-z]{2,6}$)/, '.').replace(/,/g, '.').replace(/\.+$/, '').toLowerCase();
      if (!/^[a-z0-9._%+\-]+@[a-z0-9\-]+(\.[a-z0-9\-]+)*\.[a-z]{2,}$/.test(email)) continue;
      if (!out.email) out.email = email;
      const remainder = pre.replace(m[0], ' ').replace(/\b(e-?mail|mail|email|e)\b\s*[:.\-]?/ig, ' ').replace(/\s+/g, ' ').trim();
      if (remainder.replace(/[^A-Za-z]/g, '').length >= 3) l.rest = remainder; else { l.rest = ''; l.kind = 'email'; }
    }

    // 2. phones (US 10-digit, or +country), with labels so a fax is never chosen
    const phoneRe = /(\+\s*\d{1,3}[\s.\-]*)?\(?\d{3}\)?[\s.\-]*\d{3}[\s.\-]*\d{4}\b|\+\d{1,3}[\s.\-]?\d{2,4}(?:[\s.\-]?\d{2,4}){2,4}/g;
    for (const l of lines) {
      if (l.kind === 'email') continue;
      const text = l.rest; let m; phoneRe.lastIndex = 0; const found = []; let keep = text;
      while ((m = phoneRe.exec(text))) {
        const before = text.slice(Math.max(0, m.index - 14), m.index).toLowerCase();
        let label = 'other';
        if (/(^|[^a-z])(fax|f)\s*[:.\-]?\s*$/.test(before)) label = 'fax';
        else if (/(^|[^a-z])(mobile|cell|c|m)\s*[:.\-]?\s*$/.test(before)) label = 'mobile';
        else if (/(^|[^a-z])(direct|d)\s*[:.\-]?\s*$/.test(before)) label = 'direct';
        else if (/(toll\s*free|free)\s*[:.\-]?\s*$/.test(before)) label = 'tollfree';
        else if (/(^|[^a-z])(office|tel|telephone|phone|p|t|o|work|w)\s*[:.\-]?\s*$/.test(before)) label = 'office';
        let d = digitsOf(m[0]); const intl = /^\s*\+/.test(m[0]) && !/^\+\s*1\b/.test(m[0]);
        if (!intl && d.length === 11 && d[0] === '1') d = d.slice(1);
        if (!intl && d.length !== 10) continue;
        if (/^8(00|33|44|55|66|77|88)/.test(d) && label === 'other') label = 'tollfree';
        found.push({ digits: d, label, intl, valid: intl ? d.length >= 8 && d.length <= 15 : /^[2-9]\d{2}[2-9]\d{6}$/.test(d), display: intl ? '+' + d : formatPhone(d) });
        keep = keep.replace(m[0], ' ');
      }
      if (found.length) { out.phones.push(...found); l.rest = keep; if (!/[A-Za-z]{3,}/.test(keep.replace(/\b(fax|cell|mobile|office|direct|tel|phone|phone|toll|free|work|main)\b/ig, ''))) { l.rest = ''; l.kind = 'phone'; } else l.rest = keep.replace(/\b(fax|cell|mobile|office|direct|tel|telephone|phone|toll|free|work|main)\b\s*[:.\-]?/ig, ' ').trim(); }
    }
    const rank = { mobile: 0, direct: 1, office: 2, other: 3, tollfree: 4, fax: 9 };
    const seen = new Set(); out.phones = out.phones.filter(p => (seen.has(p.digits) ? false : (seen.add(p.digits), true)));
    const usable = out.phones.filter(p => p.label !== 'fax').sort((a, b) => rank[a.label] - rank[b.label]);
    const primary = usable[0];
    if (primary) { out.phone = primary.digits; out.phoneDisplay = primary.display; }

    // 3. website
    const webRe = /\b((?:https?:\/\/)?www\.[a-z0-9\-]+(?:\.[a-z0-9\-]+)+(?:\/[^\s,;]*)?|https?:\/\/[a-z0-9\-]+(?:\.[a-z0-9\-]+)+(?:\/[^\s,;]*)?|[a-z0-9\-]+(?:\.[a-z0-9\-]+)*\.(?:com|net|org|io|co|us|biz|info|agency|insure|life|finance|financial|realty|app|me|pro|group|tax|law)\b(?:\/[^\s,;]*)?)/i;
    for (const l of lines) {
      if (l.kind === 'email' || !l.rest) continue;
      const m = l.rest.match(webRe); if (!m) continue;
      const w = m[1].replace(/[.,;:]+$/, '').toLowerCase().replace(/^https?:\/\//, '');
      const emailDom = out.email ? out.email.split('@')[1] : '', labelled = new RegExp('(^|\\s)(w|web|website|online|visit)\\s*[:.\\-]?\\s*' + m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(l.rest);
      const onlyWeb = (m[1].length / l.rest.replace(/\s/g, '').length) > 0.6 || /^www\./i.test(m[1]) || /^https?:/i.test(m[1]) || m[1].toLowerCase() === emailDom || labelled;
      if (!onlyWeb) continue;
      if (!out.website) out.website = w;
      l.rest = l.rest.replace(m[1], ' ').trim(); if (!/[A-Za-z0-9]{3,}/.test(l.rest)) { l.rest = ''; l.kind = 'web'; }
    }

    // 4. address: a street line, optional suite line, and a "City, ST 12345" line, kept together
    const streetRe = new RegExp('^\\d{1,6}[A-Za-z]?\\s+[A-Za-z0-9 .\'\\-#]+?\\b(' + STREET + ')\\b\\.?(?:[ ,]+(?:suite|ste|unit|fl|floor|apt|#)\\s*#?\\s*[A-Za-z0-9\\-]+)?', 'i');
    const poRe = /^(p\.?\s?o\.?\s*box|post office box)\s*\d+/i, suiteRe = /^(suite|ste\.?|unit|fl\.?|floor|apt\.?|#)\s*#?\s*[A-Za-z0-9\-]+\b/i;
    const cityRe = new RegExp('([A-Za-z][A-Za-z .\'\\-]+?),?\\s+(' + STATES.join('|') + ')\\.?\\s+(\\d{5})(?:-\\d{4})?\\b');
    const addrParts = [];
    lines.forEach((l, idx) => {
      if (!l.rest || l.kind) return;
      const t = l.rest;
      const city = t.match(cityRe), street = streetRe.test(t) || poRe.test(t);
      if (street || city || (addrParts.length && suiteRe.test(t))) {
        if (street && city) { addrParts.push(t.replace(/\s*,\s*/g, ', ')); }
        else if (city) { const lead = t.slice(0, city.index).trim(); addrParts.push((lead ? lead + ', ' : '') + `${city[1].trim()}, ${city[2]} ${t.slice(city.index + city[0].length - city[0].length).match(/\d{5}(?:-\d{4})?/)[0]}`); }
        else addrParts.push(t.replace(/\s*,\s*/g, ', '));
        l.kind = 'addr'; l.rest = '';
      }
    });
    out.address = addrParts.join(', ').replace(/\s+,/g, ',').replace(/,\s*,/g, ',');

    // 5. name / title / company from what is left
    const left = lines.filter(l => !l.kind).map(l => ({ ...l, t: stripNoise(l.rest) })).filter(l => l.t.replace(/[^A-Za-z]/g, '').length >= 2 && !(l.conf < 25 && l.t.length < 5));
    const emailLocal = out.email ? out.email.split('@')[0].toLowerCase() : '', emailParts = emailLocal.split(/[._\-]/).filter(Boolean);
    const domainWord = (out.email ? out.email.split('@')[1] : out.website || '').toLowerCase().replace(/^www\./, '').split('.')[0].replace(/[^a-z0-9]/g, '');
    const letters = s => s.toLowerCase().replace(/[^a-z]/g, '');

    // classify every leftover line
    left.forEach(l => {
      const noCred = l.t.replace(new RegExp(CRED.source, 'ig'), ' ');            // 'John Smith, CPA' is a name, not a title
      l.title = hits(TITLE_RES, noCred); l.strong = hits(STRONG_RES, l.t); l.weak = hits(WEAK_RES, l.t);
      l.legal = hits(LEGAL_RES, l.t); l.digits = /\d/.test(l.t);
    });
    // a line with a title AND a company ("Agent, Acme Insurance LLC") is split in two
    for (const l of left) {
      if (l.title && (l.legal || l.strong || l.weak)) {            // "Owner, Park Realty Group" / "Agent | Acme Insurance LLC"
        const sp = l.t.split(/\s*(?:\||,|\bat\b|@|\s[-\u2013]\s|\/)\s*/);
        if (sp.length >= 2) {
          const ti = sp.findIndex(p => hits(TITLE_RES, p) && !hits(LEGAL_RES, p));
          const co = sp.findIndex((p, k) => k !== ti && (hits(LEGAL_RES, p) || (!hits(TITLE_RES, p) && (hits(STRONG_RES, p) || hits(WEAK_RES, p)))));
          if (ti >= 0 && co >= 0) { l.splitTitle = sp[ti]; l.splitCompany = sp.slice(co).join(', '); }
        }
      }
    }

    const isTitleLine = l => l.splitTitle || (l.title && !l.legal);
    const isCompanyLine = l => l.splitCompany || l.legal || (l.strong && !l.title) || (l.weak && !l.title);

    // name
    const nameTok = /^(?:\p{Lu}[\p{L}'’.\-]*|\p{Lu}{2,}[\p{L}'’.\-]*|\p{L}[\p{L}'’.\-]*)$/u;
    const candidates = [];
    left.forEach((l, idx) => {
      if (l.digits || isTitleLine(l) || isCompanyLine(l)) return;
      let base = l.t.split(/\s*,\s*/)[0], creds = l.t.split(/\s*,\s*/).slice(1).join(' ');
      base = base.replace(/\b(dr|mr|mrs|ms|miss|prof)\.?\s+/i, '').replace(/[®™©*]+/g, '').trim();
      let tokens = base.split(' ').filter(Boolean);
      const credTail = tokens.length > 2 && CRED.test(tokens[tokens.length - 1]); if (credTail) { creds = creds || tokens.pop(); }
      if (tokens.length < 2 || tokens.length > 5) return;
      if (!tokens.every(t => nameTok.test(t) && !/^(and|the|&)$/i.test(t))) return;
      if (tokens.filter(t => !PARTICLES.has(t.toLowerCase()) && !/^(jr|sr|ii|iii|iv)\.?$/i.test(t)).length < 2) return;
      let score = 40 + (tokens.length === 2 ? 20 : tokens.length === 3 ? 15 : 5);
      score += Math.max(-10, Math.min(30, (l.rel - 1) * 40));
      score += [10, 6, 3][idx] || 0;
      if (emailParts.length) {
        const low = tokens.map(t => t.toLowerCase().replace(/[^a-z]/g, '')), first = low[0] || '', last = low[low.length - 1] || '';
        if (emailParts.some(p => p.length >= 3 && low.includes(p)) || emailLocal === first[0] + last || emailLocal === first + last || emailLocal === first + '.' + last || emailLocal.startsWith(first[0] + last)) score += 30;
      }
      if (l.conf < 60) score -= 8;
      candidates.push({ l, tokens, creds, score, base: tokens.join(' ') });
    });
    candidates.sort((a, b) => b.score - a.score || a.l.i - b.l.i);
    let nameLine = null;
    if (candidates.length) {
      const c = candidates[0]; nameLine = c.l; out.name = isShouting(c.base) || c.base === c.base.toLowerCase() ? titleCase(c.base) : c.base;
      out.credentials = (c.creds || '').replace(/[®™©*]/g, '').trim(); out.flags.name = c.score >= 70 ? 'ok' : 'check';
    } else {
      // no tidy name: take the largest plain leftover line so the agent has something to correct
      const pick = left.filter(l => !l.digits && !isTitleLine(l) && !isCompanyLine(l)).sort((a, b) => b.rel - a.rel || a.i - b.i)[0];
      if (pick) { nameLine = pick; out.name = isShouting(pick.t) ? titleCase(pick.t) : pick.t; out.flags.name = 'check'; } else out.flags.name = 'missing';
    }

    // title and company
    const rest = left.filter(l => l !== nameLine);
    const titleLines = rest.filter(isTitleLine);
    if (titleLines.length) { const t = titleLines[0]; out.title = stripNoise(t.splitTitle || t.t).replace(/^[\W_]+|[\W_]+$/g, ''); t.used = true; if (t.splitCompany) out.company = stripNoise(t.splitCompany); }
    const domMatch = l => domainWord.length >= 4 && letters(l.t).includes(domainWord.slice(0, Math.min(domainWord.length, 8)));
    const coScore = l => l.legal * 5 + l.strong * 3 + l.weak * 2 + (domMatch(l) ? 4 : 0) + Math.max(0, (l.rel - 1) * 3);
    let compLine = out.company ? null : rest.filter(l => !l.used && isCompanyLine(l)).sort((a, b) => coScore(b) - coScore(a) || a.i - b.i)[0];
    if (compLine) { out.company = stripNoise(compLine.splitCompany || compLine.t); compLine.used = true; }
    else if (domainWord.length >= 4) {                       // the line that matches the web / email domain is the company
      const m = rest.find(l => !l.used && !l.digits && letters(l.t).includes(domainWord.slice(0, Math.min(domainWord.length, 8))));
      if (m) { out.company = stripNoise(m.t); m.used = true; }
    }
    if (!out.company) { const guess = rest.find(l => !l.used && !l.digits && l.t.length >= 3 && l.title === 0); if (guess && rest.indexOf(guess) <= 2) { out.company = stripNoise(guess.t); guess.used = true; } }
    if (isShouting(out.company) && out.company.length > 3 && out.company.split(' ').length <= 6) { /* keep as printed: logos are often capitals */ }
    if (!out.title && nameLine) {                           // a title the word list doesn't know: the plain line right after the name
      const after = left.filter(l => l.i > nameLine.i && !l.used && l.t !== out.company && !l.digits && l.t.split(' ').length <= 5 && l.t.length <= 40 && !l.legal && !l.strong)[0];
      if (after && !isCompanyLine(after)) { out.title = stripNoise(after.t); after.used = true; }
    }
    out.other = rest.filter(l => !l.used && l.t !== out.company && l.t !== out.title).map(l => l.t).filter(t => t.length >= 4).slice(0, 3);
    out.occupation = out.title && out.company ? `${out.title}, ${out.company}` : (out.title || out.company);
    out.flags.phone = !out.phone ? 'missing' : (usable[0] && usable[0].valid ? 'ok' : 'check');
    out.flags.email = out.email ? 'ok' : 'missing';
    if (out.email && out.name) {                            // a first letter that doesn't match the name is probably misread
      const toks = out.name.toLowerCase().split(' ').map(t => t.replace(/[^a-z]/g, '')).filter(Boolean), first = toks[0] || '', last = toks[toks.length - 1] || '', local = out.email.split('@')[0];
      if (first && last.length >= 3 && local.length === last.length + 1 && local.endsWith(last) && local[0] !== first[0]) { out.flags.email = 'check'; out.emailSuggestion = first[0] + local.slice(1) + '@' + out.email.split('@')[1]; }
    }
    out.score = (out.name ? 2 : 0) + (out.phone ? 2 : 0) + (out.email ? 2 : 0) + (out.company ? 1 : 0) + (out.title ? 1 : 0);
    return out;
  }

  // Everything that doesn't have a field of its own goes in the notes.
  function buildNotes(p, dateStr) {
    const alts = (p.phones || []).filter(x => x.digits !== p.phone).map(x => `${{ mobile: 'Cell', direct: 'Direct', office: 'Office', fax: 'Fax', tollfree: 'Toll-free', other: 'Alt' }[x.label]} ${x.display}`);
    const bits = [`\ud83d\udcc7 Business card \u00b7 ${dateStr}`, p.website, p.address, p.credentials, ...alts, ...(p.other || [])].filter(Boolean);
    return bits.join(' \u00b7 ').slice(0, 480);
  }

  // ── browser: prepare the photo and read it on the device ───────
  const BASE = 'ocr/';
  let worker = null, onLog = null;
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load the scanner (' + src + ')')); document.head.appendChild(s); });
  async function engine() {
    if (!worker) {
      worker = (async () => {
        if (!window.Tesseract) await loadScript(BASE + 'tesseract.min.js');
        return window.Tesseract.createWorker('eng', 1, { workerPath: BASE + 'worker.min.js', corePath: BASE, langPath: BASE + 'lang', gzip: true, logger: m => { if (onLog) onLog(m); } });
      })().catch(e => { worker = null; throw e; });
    }
    return worker;
  }
  async function toCanvas(file, rotation, maxSide) {
    let bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) { bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('That image could not be read. HEIC photos from some iPhones need to be JPG or PNG.')); i.src = URL.createObjectURL(file); }); }
    const w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight, rot = ((rotation || 0) % 360 + 360) % 360, swap = rot === 90 || rot === 270;
    let sc = Math.min(1, maxSide / Math.max(w, h)); if (Math.max(w, h) < 1400) sc = Math.min(1.6, 1500 / Math.max(w, h));      // small photo: enlarge a little
    const cw = Math.round((swap ? h : w) * sc), ch = Math.round((swap ? w : h) * sc);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch; const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cw, ch); ctx.translate(cw / 2, ch / 2); ctx.rotate(rot * Math.PI / 180); ctx.drawImage(bmp, -w * sc / 2, -h * sc / 2, w * sc, h * sc);
    return c;
  }
  function enhance(canvas, invert) {                           // grayscale + stretch contrast; optionally flip light/dark
    const ctx = canvas.getContext('2d'), img = ctx.getImageData(0, 0, canvas.width, canvas.height), d = img.data, n = d.length / 4, hist = new Uint32Array(256);
    for (let i = 0; i < d.length; i += 4) { const g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0; d[i] = g; hist[g]++; }
    let lo = 0, hi = 255, acc = 0; for (; lo < 255 && acc + hist[lo] < n * 0.02; lo++) acc += hist[lo]; acc = 0; for (; hi > 0 && acc + hist[hi] < n * 0.02; hi--) acc += hist[hi];
    const span = Math.max(40, hi - lo);
    for (let i = 0; i < d.length; i += 4) { let g = Math.max(0, Math.min(255, (d[i] - lo) * 255 / span)); if (invert) g = 255 - g; d[i] = d[i + 1] = d[i + 2] = g; d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0); return canvas;
  }
  async function readOnce(canvas, psm) {
    const w = await engine(); await w.setParameters({ tessedit_pageseg_mode: String(psm) });
    const { data } = await w.recognize(canvas);
    const lines = (data.lines || []).map(l => ({ text: l.text, h: l.bbox ? l.bbox.y1 - l.bbox.y0 : 0, conf: l.confidence }));
    return { text: data.text || '', lines, confidence: data.confidence || 0 };
  }
  // opts: { rotation, autoRotate, onProgress(0..1, label) }. Returns { parsed, text, lines, confidence, rotation, preview, aiImage }.
  async function scan(file, opts = {}) {
    const prog = opts.onProgress || (() => {});
    onLog = m => { if (m.status === 'recognizing text') prog(0.35 + 0.6 * m.progress, 'Reading the card\u2026'); else if (/loading|initializ/.test(m.status || '')) prog(Math.min(0.3, 0.05 + (m.progress || 0) * 0.25), 'Preparing the scanner (first time only)\u2026'); };
    prog(0.02, 'Preparing the photo\u2026');
    const rot0 = opts.rotation || 0;
    await engine();
    let best = null;
    // A scan only counts as good when it found a phone or email AND the engine was reasonably sure of the text:
    // sideways photos come out as confident-looking nonsense with no contact details.
    const good = c => !!(c.parsed.phone || c.parsed.email) && c.confidence >= 55 && c.parsed.score >= 4;
    const quality = c => c.parsed.score + ((c.parsed.phone || c.parsed.email) ? 3 : 0) + c.confidence / 50;
    const attempt = async (rot, invert, psm, label) => {
      const c = enhance(await toCanvas(file, rot, 2000), invert);
      const r = await readOnce(c, psm), parsed = parseCard({ lines: r.lines });
      const cand = { ...r, parsed, score: parsed.score, rotation: rot, pass: label };
      if (!best || quality(cand) > quality(best)) best = cand;
    };
    await attempt(rot0, false, 3, 'first');
    if (!good(best)) { prog(0.7, 'Trying another way\u2026'); await attempt(rot0, true, 11, 'second'); }
    if (!good(best) && opts.autoRotate !== false) {             // photographed sideways or upside down?
      for (const extra of [90, 270, 180]) { prog(0.8, 'Checking the card\u2019s orientation\u2026'); await attempt((rot0 + extra) % 360, false, 3, 'rotated'); if (good(best)) break; }
    }
    const shown = await toCanvas(file, best.rotation, 2000), ai = document.createElement('canvas'), prev = document.createElement('canvas');
    const k = Math.min(1, 1600 / Math.max(shown.width, shown.height)), s2 = Math.min(1, 900 / Math.max(shown.width, shown.height));
    ai.width = Math.round(shown.width * k); ai.height = Math.round(shown.height * k); ai.getContext('2d').drawImage(shown, 0, 0, ai.width, ai.height);
    prev.width = Math.round(shown.width * s2); prev.height = Math.round(shown.height * s2); prev.getContext('2d').drawImage(shown, 0, 0, prev.width, prev.height);
    prog(1, 'Done');
    return { ...best, preview: prev.toDataURL('image/jpeg', 0.8), aiImage: ai.toDataURL('image/jpeg', 0.82) };
  }
  // A smaller JPEG of the photo (used only if the person chooses the optional AI reading).
  async function downscale(file, rotation, maxSide) {
    const c = await toCanvas(file, rotation || 0, maxSide || 1600), k = Math.min(1, (maxSide || 1600) / Math.max(c.width, c.height));
    const o = document.createElement('canvas'); o.width = Math.round(c.width * k); o.height = Math.round(c.height * k); o.getContext('2d').drawImage(c, 0, 0, o.width, o.height);
    return o.toDataURL('image/jpeg', 0.82);
  }
  async function stop() { if (worker) { const w = await worker; worker = null; try { await w.terminate(); } catch (e) {} } }

  return { parseCard, buildNotes, formatPhone, scan, downscale, stop, BASE };
})();
if (typeof module !== 'undefined') module.exports = CARDSCAN;
