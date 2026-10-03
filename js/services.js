// Interactive pieces used on individual service pages
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sections that play once they scroll into view
  const playIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('run'); playIO.unobserve(e.target); }
  }), { threshold: 0.3 });
  document.querySelectorAll('.play-on-view').forEach((el) => (calm ? el.classList.add('run') : playIO.observe(el)));

  // Counting numbers
  const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, t0 = performance.now();
    if (calm) { el.textContent = to; return; }
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 1600);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.5 });
  document.querySelectorAll('.count-up').forEach((el) => countIO.observe(el));

  // Review router demo: 4-5 stars go to Google, 1-3 go privately to the owner
  const router = document.getElementById('router');
  if (router) {
    const stars = [...router.querySelectorAll('.rt-stars button')];
    const good = router.querySelector('.rt-out.good');
    const bad = router.querySelector('.rt-out.bad');
    const hint = router.querySelector('.rt-hint');
    stars.forEach((b) => b.addEventListener('click', () => {
      const v = +b.dataset.v;
      stars.forEach((s) => { s.classList.toggle('on', +s.dataset.v <= v); s.setAttribute('aria-checked', String(+s.dataset.v === v)); });
      good.hidden = v < 4;
      bad.hidden = v >= 4;
      hint.hidden = true;
    }));
  }
})();
