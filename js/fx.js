// Particles and cursor spotlight for every ".live" dark section
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.live').forEach((sec) => {
    const spot = sec.querySelector(':scope > .fx-spot');
    if (spot) sec.addEventListener('mousemove', (e) => {
      const r = sec.getBoundingClientRect();
      spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
    });
    const cvs = sec.querySelector(':scope > .fx-particles');
    if (!cvs || calm) return;
    const ctx = cvs.getContext('2d');
    let w, h, pts = [], running = false;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = sec.clientWidth; h = sec.clientHeight;
      cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.round(Math.min(80, w * h / 16000)) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, vx: (Math.random() - 0.5) * 0.15, vy: -(Math.random() * 0.35 + 0.08), a: Math.random() * 0.5 + 0.2 }));
    };
    const draw = () => {
      if (!running || document.documentElement.classList.contains('lite')) { running = false; return; }
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(150,240,196,${p.a})`; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let k = i + 1; k < pts.length; k++) {
        const dx = pts[i].x - pts[k].x, dy = pts[i].y - pts[k].y, d = dx * dx + dy * dy;
        if (d < 9000) { ctx.strokeStyle = `rgba(94,234,168,${0.12 * (1 - d / 9000)})`; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[k].x, pts[k].y); ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(draw); }).observe(sec);
  });
})();

// Footer signup: hands the email to WhatsApp so the request reaches a real inbox
(() => {
  const form = document.getElementById('newsForm');
  if (!form) return;
  const input = document.getElementById('newsEmail');
  const msg = document.getElementById('newsMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity() || !input.value.trim()) { msg.textContent = 'Enter a valid email address.'; input.focus(); return; }
    const text = encodeURIComponent(`Hi GenLeads, please add me to your updates: ${input.value.trim()}`);
    window.open(`https://wa.me/918667480588?text=${text}`, '_blank', 'noopener');
    msg.textContent = 'Opening WhatsApp to confirm your signup.';
  });
})();


// Performance guard: measure the real frame rate after load. On slow machines switch to normal
// scrolling and the lighter effect set. Decorative animations in off-screen dark sections pause.
(() => {
  const root = document.documentElement;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('paused', !e.isIntersecting)), { rootMargin: '100px' });
  document.querySelectorAll('.dark').forEach((s) => io.observe(s));
  const goLite = () => {
    root.classList.add('lite');
    if (window.GL_PERF) window.GL_PERF.glide = false;
    if (window.glLenis) { window.glLenis.destroy(); window.glLenis = null; if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }
  };
  if (root.classList.contains('lite')) { goLite(); return; }
  const probe = () => {
    let n = 0;
    const t0 = performance.now();
    const step = (t) => {
      n++;
      if (t - t0 < 1500) requestAnimationFrame(step);
      else if (n / ((t - t0) / 1000) < 45) goLite();
    };
    requestAnimationFrame(step);
  };
  const start = () => setTimeout(probe, 800);
  if (document.readyState === 'complete') start(); else addEventListener('load', start);

  // Lag shows up while scrolling, so also time the frames of the first real scrolls
  const deltas = [];
  let last = 0, sampling = false, done = false;
  const sample = (t) => {
    if (last) deltas.push(t - last);
    last = t;
    if (deltas.length < 90) requestAnimationFrame(sample);
    else {
      done = true;
      const sorted = deltas.slice().sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const slow = deltas.filter((d) => d > 34).length;
      if (median > 22 || slow > 12) goLite();
    }
  };
  addEventListener('scroll', () => {
    if (done || sampling || root.classList.contains('lite')) return;
    sampling = true;
    requestAnimationFrame(sample);
  }, { passive: true });
})();
