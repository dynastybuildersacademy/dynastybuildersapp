// ════════════════════════════════════════════════════════════════
// DBA QUIZ ENGINE — Shared across training.html and academy.html
// Tracks completion per agent in localStorage + syncs to Monday
// ════════════════════════════════════════════════════════════════

const QUIZ_STORAGE_KEY = () => {
  const s = (typeof AUTH !== 'undefined') ? AUTH.getSession() : null;
  return 'dba_quiz_' + (s?.agentId || 'guest');
};

// ── Load / Save progress ─────────────────────────────────────
function quizLoadProgress() {
  try { return JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY()) || '{}'); } catch(e) { return {}; }
}
function quizSaveProgress(data) {
  try { localStorage.setItem(QUIZ_STORAGE_KEY(), JSON.stringify(data)); } catch(e) {}
}
function quizMarkComplete(quizId, score, total) {
  const prog = quizLoadProgress();
  if (!prog[quizId] || score > (prog[quizId].score || 0)) {
    prog[quizId] = { score, total, pct: Math.round(score/total*100), completedAt: new Date().toISOString(), passed: score/total >= 0.7 };
  }
  quizSaveProgress(prog);
  // Sync to Monday if key available
  try {
    const s = (typeof AUTH !== 'undefined') ? AUTH.getSession() : null;
    if (s && typeof mondayQuery === 'function' && typeof AUTH !== 'undefined' && AUTH.getMondayKey()) {
      const boardId = localStorage.getItem('dba_quiz_board') || '';
      if (boardId) {
        const cv = JSON.stringify(JSON.stringify({
          text_quiz_agent: s.name || s.agentId,
          text_quiz_id: quizId,
          numbers_quiz_score: score,
          numbers_quiz_total: total,
          numbers_quiz_pct: Math.round(score/total*100),
          status_quiz_pass: { label: prog[quizId].passed ? 'Passed' : 'Needs Review' },
        }));
        mondayQuery(`mutation { create_item(board_id:${boardId}, item_name:"${(s.name||s.agentId).replace(/"/g,"'")} · ${quizId}", column_values:${cv}, create_labels_if_missing:true) { id } }`).catch(()=>{});
      }
    }
  } catch(e) {}
  return prog[quizId];
}

// ── Render quiz inline after a module ────────────────────────
// quizDef: { id, title, questions: [{ q, options:[], answer(0-based idx), explain }] }
function renderQuiz(containerId, quizDef) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const prog = quizLoadProgress();
  const prior = prog[quizDef.id];
  const state = { current: 0, answers: {}, submitted: false };

  function draw() {
    const q = quizDef.questions[state.current];
    const isLast = state.current === quizDef.questions.length - 1;
    const answered = state.answers[state.current] !== undefined;
    const correct = state.submitted && state.answers[state.current] === q.answer;

    el.innerHTML = `
      <div style="background:var(--navy-mid);border:1px solid rgba(201,168,76,.15);border-radius:12px;padding:16px;margin-top:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:900;color:var(--gold);">
            🧠 Quiz: ${quizDef.title}
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);">
            ${state.current+1} / ${quizDef.questions.length}
            ${prior?.passed ? ' · <span style="color:var(--green);">✓ Passed ' + prior.pct + '%</span>' : ''}
          </div>
        </div>

        <div style="font-size:14px;font-weight:600;margin-bottom:12px;line-height:1.5;">${q.q}</div>

        <div id="quiz-options" style="display:flex;flex-direction:column;gap:7px;">
          ${q.options.map((opt, i) => {
            let bg = 'rgba(255,255,255,.04)'; let border = 'rgba(255,255,255,.1)'; let color = 'var(--text)';
            if (state.submitted) {
              if (i === q.answer) { bg='rgba(45,202,115,.1)'; border='rgba(45,202,115,.4)'; color='#2DCA73'; }
              else if (i === state.answers[state.current]) { bg='rgba(231,76,60,.08)'; border='rgba(231,76,60,.3)'; color='#E74C3C'; }
            } else if (state.answers[state.current] === i) {
              bg='rgba(201,168,76,.1)'; border='rgba(201,168,76,.4)'; color='var(--gold-light)';
            }
            return `<div onclick="quizSelect(${i})" style="cursor:pointer;background:${bg};border:1px solid ${border};border-radius:8px;padding:10px 12px;color:${color};font-size:13px;transition:all .15s;">${String.fromCharCode(65+i)}. ${opt}</div>`;
          }).join('')}
        </div>

        ${state.submitted && q.explain ? `<div style="background:rgba(0,0,0,.2);border-radius:8px;padding:10px 12px;margin-top:10px;font-family:'DM Mono',monospace;font-size:11px;color:rgba(250,246,238,.6);line-height:1.6;">💡 ${q.explain}</div>` : ''}

        <div style="display:flex;gap:8px;margin-top:12px;">
          ${!state.submitted && answered ? `<button onclick="quizSubmitAnswer()" style="flex:1;background:linear-gradient(135deg,#C9A84C,#E8C97A);border:none;border-radius:8px;padding:10px;color:#0A1628;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:900;cursor:pointer;">Confirm Answer</button>` : ''}
          ${state.submitted && !isLast ? `<button onclick="quizNext()" style="flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:10px;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:900;cursor:pointer;">Next →</button>` : ''}
          ${state.submitted && isLast ? `<button onclick="quizFinish()" style="flex:1;background:linear-gradient(135deg,#2DCA73,#27AE60);border:none;border-radius:8px;padding:10px;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:900;cursor:pointer;">See Results</button>` : ''}
        </div>
      </div>`;

    // Expose callbacks on window for onclick handlers
    window.quizSelect = (i) => {
      if (state.submitted) return;
      state.answers[state.current] = i;
      draw();
    };
    window.quizSubmitAnswer = () => { state.submitted = true; draw(); };
    window.quizNext = () => { state.current++; state.submitted = false; draw(); };
    window.quizFinish = () => {
      const correct = quizDef.questions.filter((q,i) => state.answers[i] === q.answer).length;
      const total = quizDef.questions.length;
      const pct = Math.round(correct/total*100);
      const passed = pct >= 70;
      quizMarkComplete(quizDef.id, correct, total);
      el.innerHTML = `
        <div style="background:${passed?'rgba(45,202,115,.06)':'rgba(231,76,60,.06)'};border:1px solid ${passed?'rgba(45,202,115,.25)':'rgba(231,76,60,.2)'};border-radius:12px;padding:20px;text-align:center;margin-top:12px;">
          <div style="font-size:40px;margin-bottom:8px;">${passed?'🏆':'📚'}</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:${passed?'#2DCA73':'#E74C3C'};">${pct}%</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;margin:4px 0;">${passed?'PASSED!':'Keep Studying'}</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);margin-bottom:16px;">${correct} of ${total} correct · ${passed?'Section complete ✓':'70% needed to pass'}</div>
          ${!passed ? `<button onclick="location.reload()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:8px 18px;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;cursor:pointer;">Retry Quiz</button>` : ''}
          ${passed ? `<div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--green);">✓ Completion recorded</div>` : ''}
        </div>`;
    };
  }

  draw();
}

// ── Completion dashboard (for roster-admin / progress tabs) ──
function quizGetAllProgress() {
  return quizLoadProgress();
}

function quizRenderProgressTable(containerId, quizIds) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const prog = quizLoadProgress();
  const rows = quizIds.map(id => {
    const p = prog[id];
    if (!p) return `<tr><td style="padding:7px 8px;font-size:12px;">${id}</td><td colspan="3" style="padding:7px 8px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);">Not started</td></tr>`;
    const date = new Date(p.completedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'});
    return `<tr style="border-bottom:1px solid rgba(255,255,255,.05);">
      <td style="padding:7px 8px;font-size:12px;">${id.replace(/_/g,' ')}</td>
      <td style="padding:7px 8px;font-family:'DM Mono',monospace;font-size:11px;color:${p.passed?'#2DCA73':'#E74C3C'};">${p.pct}%</td>
      <td style="padding:7px 8px;"><span style="font-family:'DM Mono',monospace;font-size:9px;padding:2px 6px;border-radius:6px;background:${p.passed?'rgba(45,202,115,.1)':'rgba(231,76,60,.08)'};border:1px solid ${p.passed?'rgba(45,202,115,.3)':'rgba(231,76,60,.2)'};color:${p.passed?'#2DCA73':'#E74C3C'};">${p.passed?'Passed':'Retry'}</span></td>
      <td style="padding:7px 8px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);">${date}</td>
    </tr>`;
  }).join('');
  el.innerHTML = `<table style="width:100%;border-collapse:collapse;">
    <thead><tr style="border-bottom:1px solid rgba(255,255,255,.1);">
      <th style="padding:6px 8px;text-align:left;font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);">Section</th>
      <th style="padding:6px 8px;font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);">Score</th>
      <th style="padding:6px 8px;font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);">Status</th>
      <th style="padding:6px 8px;font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);">Date</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}
