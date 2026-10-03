// Scroll effects and small interactions for About, How it works, FAQ, Contact and legal pages
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gs = window.gsap && window.ScrollTrigger && !calm;

  // About: words light up as you scroll
  document.querySelectorAll('.word-reveal').forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    if (gs) gsap.to(el.querySelectorAll('.w'), { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    else el.querySelectorAll('.w').forEach((w) => { w.style.opacity = 1; });
  });

  // About: earlier cards shrink slightly as the next one stacks on top
  if (gs) {
    const cards = gsap.utils.toArray('.stack-card');
    cards.forEach((c, i) => {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: 0.94 - (cards.length - i) * 0.01, ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 25%', scrub: true } });
    });
  }

  // How it works: line fills with scroll and each stage lights up
  const journey = document.getElementById('journey');
  if (journey) {
    const steps = [...journey.querySelectorAll('.j-step')];
    const fill = document.getElementById('jFill');
    const update = () => {
      const r = journey.getBoundingClientRect();
      const mid = innerHeight * 0.55;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
      steps.forEach((s) => s.classList.toggle('lit', s.getBoundingClientRect().top < mid));
    };
    if (calm) steps.forEach((s) => s.classList.add('lit'));
    else { addEventListener('scroll', () => requestAnimationFrame(update), { passive: true }); update(); }
  }

  // FAQ: tabs and live search
  const list = document.getElementById('faqList');
  if (list) {
    const items = [...list.querySelectorAll('details')];
    const tabs = [...document.querySelectorAll('.faq-tabs button')];
    const search = document.getElementById('faqSearch');
    const empty = document.getElementById('faqEmpty');
    let cat = 'all';
    const apply = () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      items.forEach((d) => {
        const ok = (cat === 'all' || d.dataset.cat === cat) && (!q || d.textContent.toLowerCase().includes(q));
        d.hidden = !ok;
        if (ok) shown++;
        if (q && ok) d.open = true;
      });
      empty.hidden = shown > 0;
    };
    tabs.forEach((t) => t.addEventListener('click', () => { cat = t.dataset.cat; tabs.forEach((x) => x.classList.toggle('on', x === t)); apply(); }));
    search.addEventListener('input', apply);
  }

  // Contact: copy buttons
  document.querySelectorAll('button.copy[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const t = b.textContent; b.textContent = 'Copied'; b.classList.add('done');
    setTimeout(() => { b.textContent = t; b.classList.remove('done'); }, 1600);
  }));

  // Legal: highlight the section being read
  const toc = document.querySelector('.toc');
  if (toc) {
    const links = [...toc.querySelectorAll('a')];
    const secs = links.map((a) => document.querySelector(a.getAttribute('href')));
    const spy = () => {
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === cur));
    };
    addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true });
    spy();
  }
})();
