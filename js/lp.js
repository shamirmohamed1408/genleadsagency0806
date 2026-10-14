// Landing page: "money on the table" calculator
(() => {
  const el = (id) => document.getElementById(id);
  const weekly = el('cWeekly'), value = el('cValue'), missed = el('cMissed');
  if (!weekly || !value || !missed) return;

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const MONTH_WEEKS = 4;   // conservative: 4 weeks a month
  const YEAR_MONTHS = 12;
  const shown = {};        // last displayed numbers, for smooth count animation
  const timers = {};

  const fill = (input) => {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--p', p + '%');
  };

  const setNum = (id, to, fmt) => {
    const node = el(id);
    if (calm || shown[id] === undefined) { node.textContent = fmt(to); shown[id] = to; return; }
    const from = shown[id], t0 = performance.now(), dur = 420;
    cancelAnimationFrame(timers[id]);
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const cur = from + (to - from) * (1 - Math.pow(1 - k, 3));
      node.textContent = fmt(cur);
      if (k < 1) timers[id] = requestAnimationFrame(tick); else shown[id] = to;
    };
    timers[id] = requestAnimationFrame(tick);
  };

  const dots = el('vizDots');
  const drawDots = (total, lost) => {
    while (dots.children.length < total) dots.appendChild(document.createElement('i'));
    while (dots.children.length > total) dots.lastChild.remove();
    [...dots.children].forEach((d, i) => d.classList.toggle('lost', i >= total - lost));
  };

  function render() {
    const w = +weekly.value, v = +value.value;
    // The "missed" slider can never exceed what comes in
    missed.max = w;
    if (+missed.value > w) missed.value = w;
    const m = +missed.value;
    el('missedMax').textContent = w;

    const perWeek = m * v, perMonth = perWeek * MONTH_WEEKS, perYear = perMonth * YEAR_MONTHS;
    el('vWeekly').textContent = w >= 50 ? '50+' : w;
    el('vValue').textContent = inr(v);
    el('vMissed').textContent = m;
    [weekly, value, missed].forEach(fill);

    setNum('oMonth', perMonth, inr);
    setNum('oWeek', perWeek, inr);
    setNum('oYear', perYear, inr);
    setNum('oCust', m * MONTH_WEEKS, (n) => Math.round(n));

    el('oNote').innerHTML = m === 0
      ? 'Replying to everything in time is rare. Most businesses find a few slipping through once they check.'
      : `Even if only 1 in 3 of them would have booked, that is <b>${inr(perMonth / 3)}</b> a month.`;

    drawDots(Math.min(w, 50), Math.min(m, 50));
  }

  [weekly, value, missed].forEach((i) => i.addEventListener('input', render));
  render();

  // Hand the numbers to the audit form so it can show the visitor their own estimate
  el('calcCta').addEventListener('click', () => {
    try {
      const m = +missed.value, v = +value.value;
      localStorage.setItem('genleads-lp-calc', JSON.stringify({ weekly: +weekly.value, value: v, missed: m, perMonth: m * v * MONTH_WEEKS }));
    } catch {}
  });
})();
