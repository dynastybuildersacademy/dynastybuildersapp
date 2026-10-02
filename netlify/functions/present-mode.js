// Dynasty Builders Academy — in-app Present mode for slide pages
// (Thankful Thursday, Dynasty Monthly Contest). Lets you present the
// slides the app already draws, full screen, instead of exporting a
// PowerPoint first. Works with keyboards and presentation clickers
// (which send PageDown/PageUp or arrow keys), touch swipes, and taps.
// Needs the page's existing goToSlide / nextSlide / prevSlide and #stage.
(function () {
  const css = `
  .pm-btn{padding:7px 14px;font-size:12px;font-weight:700;border-radius:4px;cursor:pointer;
    background:linear-gradient(135deg,#C9A84C,#E8C97A);color:#1E1A10;border:none;font-family:inherit;}
  body.presenting{overflow:hidden;cursor:none;}
  body.presenting.pm-awake{cursor:default;}
  body.presenting .topnav, body.presenting .admin-bar{display:none !important;}
  body.presenting .stage{position:fixed;inset:0;height:100vh;height:100dvh;z-index:1000;background:#000;}
  body.presenting .nav-controls, body.presenting .slide-counter{opacity:0;transition:opacity .3s;}
  body.presenting.pm-awake .nav-controls, body.presenting.pm-awake .slide-counter{opacity:1;}
  .pm-bar{position:fixed;top:12px;right:12px;z-index:1100;display:none;gap:6px;}
  body.presenting.pm-awake .pm-bar{display:flex;}
  .pm-bar button{background:rgba(0,0,0,.55);color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:6px;
    padding:8px 12px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;}
  .pm-black{position:fixed;inset:0;background:#000;z-index:1200;display:none;}
  body.pm-blackout .pm-black{display:block;}
  .pm-help{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:1100;background:rgba(0,0,0,.7);
    color:#fff;font-size:12px;padding:8px 14px;border-radius:20px;display:none;white-space:nowrap;}
  body.presenting.pm-awake .pm-help{display:block;}
  @media (max-width:600px){.pm-help{display:none !important;}}`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  let presenting = false, sleepTimer = null;
  const body = document.body;

  function wake() {
    body.classList.add('pm-awake');
    clearTimeout(sleepTimer);
    sleepTimer = setTimeout(() => body.classList.remove('pm-awake'), 2500);
  }

  async function enter() {
    if (presenting) return;
    presenting = true;
    body.classList.add('presenting');
    // Close any open editor modal so it doesn't sit on top of the slides.
    document.querySelectorAll('.modal-bg').forEach(m => { m.classList.remove('open'); m.style.display = ''; });
    const pptx = document.getElementById('pptx-modal'); if (pptx) pptx.style.display = 'none';
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch (e) { /* iPhone Safari has no fullscreen API — the CSS still fills the screen */ }
    wake();
  }

  function exit() {
    if (!presenting) return;
    presenting = false;
    body.classList.remove('presenting', 'pm-awake', 'pm-blackout');
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
  }

  // Leaving fullscreen with the browser's own Esc also ends Present mode.
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && presenting) exit();
  }));

  // Keys. Arrow keys are already handled by the page itself, so they are
  // left alone here (handling them twice would skip slides).
  document.addEventListener('keydown', e => {
    if (!presenting) {
      if ((e.key === 'F5' || (e.key === 'p' && (e.metaKey || e.ctrlKey) && e.shiftKey)) && !e.target.closest('input,textarea,select')) { e.preventDefault(); enter(); }
      return;
    }
    const k = e.key;
    if (['PageDown', ' ', 'Enter', 'n', 'N'].includes(k)) { e.preventDefault(); nextSlide(); }
    else if (['PageUp', 'Backspace', 'p', 'P'].includes(k)) { e.preventDefault(); prevSlide(); }
    else if (k === 'Home') { e.preventDefault(); goToSlide(0); }
    else if (k === 'End') { e.preventDefault(); goToSlide(typeof slides !== 'undefined' ? slides.length - 1 : 0); }
    else if (['b', 'B', '.'].includes(k)) { e.preventDefault(); body.classList.toggle('pm-blackout'); }
    else if (k === 'Escape') { exit(); }
    if (k !== 'Escape') wake();
  });

  // While presenting, a click anywhere advances (like PowerPoint) instead
  // of opening the winner editors that admins see on these slides.
  document.addEventListener('click', e => {
    if (!presenting) return;
    if (e.target.closest('.pm-bar, .nav-controls, a')) return;
    e.preventDefault(); e.stopPropagation();
    if (body.classList.contains('pm-blackout')) { body.classList.remove('pm-blackout'); return; }
    nextSlide(); wake();
  }, true);
  document.addEventListener('mousemove', () => { if (presenting) wake(); });
  document.addEventListener('touchstart', () => { if (presenting) wake(); }, { passive: true });

  // UI: a Present button in the top bar, plus controls shown while presenting.
  function mount() {
    const right = document.querySelector('.topnav-right');
    if (right && !document.getElementById('pm-start')) {
      const b = document.createElement('button');
      b.id = 'pm-start'; b.className = 'pm-btn'; b.type = 'button'; b.textContent = '▶ Present';
      b.title = 'Present full screen (clicker, arrow keys, or tap to advance)';
      b.onclick = enter;
      right.insertBefore(b, right.firstChild);
    }
    const bar = document.createElement('div');
    bar.className = 'pm-bar';
    bar.innerHTML = '<button type="button" id="pm-black">⬛ Blank</button><button type="button" id="pm-exit">✕ Exit</button>';
    document.body.appendChild(bar);
    bar.querySelector('#pm-exit').onclick = exit;
    bar.querySelector('#pm-black').onclick = () => body.classList.toggle('pm-blackout');
    const black = document.createElement('div'); black.className = 'pm-black'; document.body.appendChild(black);
    const help = document.createElement('div'); help.className = 'pm-help';
    help.textContent = '→ / Space / clicker: next · ← back · B: blank screen · Esc: exit';
    document.body.appendChild(help);
    // ?present=1 opens ready to present (browsers only allow fullscreen
    // after a tap, so the first tap goes full screen).
    if (new URLSearchParams(location.search).get('present') === '1') {
      const gate = document.createElement('button');
      gate.type = 'button'; gate.id = 'pm-gate';
      gate.style.cssText = 'position:fixed;inset:0;z-index:1300;border:none;background:rgba(0,0,0,.85);color:#fff;font:700 22px DM Sans,sans-serif;cursor:pointer;';
      gate.textContent = '▶ Tap to start the presentation';
      gate.onclick = () => { gate.remove(); enter(); };
      document.body.appendChild(gate);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  window.PresentMode = { enter, exit, isPresenting: () => presenting };
})();
