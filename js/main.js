const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);

// Marquees: repeat items until each half is wider than the screen, so wide monitors never see a gap
document.querySelectorAll('.marquee-track').forEach((t) => {
  const base = t.innerHTML;
  let guard = 0;
  while (t.scrollWidth < Math.max(innerWidth, 2560) && guard++ < 6) t.innerHTML += base;
  t.innerHTML += t.innerHTML;
});

// Hero: rotating last line
const rots = [...document.querySelectorAll('.rot')];
if (rots.length && !reduce) {
  let cur = 0;
  setInterval(() => {
    const prev = rots[cur];
    prev.classList.remove('on'); prev.classList.add('out');
    setTimeout(() => prev.classList.remove('out'), 900);
    cur = (cur + 1) % rots.length;
    rots[cur].classList.add('on');
  }, 2600);
}

// Nav: solid on scroll, dark variant over dark sections
const nav = document.getElementById('nav');
const updateNav = () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  nav.style.pointerEvents = 'none';
  const el = document.elementFromPoint(innerWidth / 2, 80);
  nav.style.pointerEvents = '';
  nav.classList.toggle('on-dark', !!(el && el.closest('.dark')));
};
addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Hero chat: messages arrive one by one, then loop
const stage = document.getElementById('stage');
if (stage && !reduce) {
  stage.classList.add('seq');
  const typing = stage.querySelector('.typing');
  const times = { 1: 900, 2: 1600, 3: 2900, 4: 4400, 5: 5800 };
  const play = () => {
    stage.querySelectorAll('[data-step]').forEach((el) => el.classList.remove('on'));
    typing.classList.remove('done');
    Object.entries(times).forEach(([n, t]) => setTimeout(() => {
      stage.querySelectorAll(`[data-step="${n}"]`).forEach((el) => el.classList.add('on'));
      if (n === '3') typing.classList.add('done');
    }, t));
    setTimeout(play, 12000);
  };
  play();
}

// 3D tilt on the hero phone
const tilt = document.getElementById('tilt');
if (tilt && fine && !reduce) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  });
  hero.addEventListener('mouseleave', () => { tilt.style.transform = ''; });
}

// Cursor spotlight on cards
document.querySelectorAll('.spot').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

if (!hasGsap || reduce) {
  document.querySelectorAll('.flow-line path').forEach((p) => { p.style.strokeDashoffset = 0; });
  document.querySelectorAll('.step').forEach((s) => s.classList.add('lit'));
} else {
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  // Smooth scroll, synced with ScrollTrigger
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -72 }); }
    }));
  }

  const splitWords = (el) => (window.SplitText ? new SplitText(el, { type: 'words', wordsClass: 'word' }).words : [el]);

  // Hero intro
  const heroWords = [...splitWords(document.querySelector('.h1-static')), document.querySelector('.rotator')];
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.badge', { y: 20, opacity: 0, duration: 1 })
    .from(heroWords, { yPercent: 110, opacity: 0, rotate: 4, duration: 1.2, stagger: 0.06 }, '-=0.7')
    .from('.hero .fade-up', { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.9')
    .from('.hero-stage', { y: 60, opacity: 0, scale: 0.94, duration: 1.4 }, '-=1.2')
    .from('.stats > div', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=1');

  // Counters
  document.querySelectorAll('.count').forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.to, duration: 2, ease: 'power3.out', delay: el.closest('.hero-stage') ? 2.6 : 0.8,
      onUpdate: () => { el.textContent = Math.round(o.v); },
      scrollTrigger: { trigger: el, start: 'top 95%' } });
  });

  // Section headings: words rise in
  document.querySelectorAll('h2.split').forEach((h) => {
    gsap.from(splitWords(h), { yPercent: 100, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  // Video grows to full width on scroll
  gsap.fromTo('#videoBox', { scale: 0.86, borderRadius: 56 }, { scale: 1, borderRadius: 36, ease: 'none',
    scrollTrigger: { trigger: '#videoBox', start: 'top 95%', end: 'top 25%', scrub: true } });

  // Problem statement: words light up as you scroll
  const st = document.getElementById('statement');
  st.innerHTML = st.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
  gsap.to('#statement .w', { opacity: 1, ease: 'none', stagger: 0.1,
    scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });

  // Generic reveals
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: (els) => gsap.from(els, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }),
    once: true,
  });

  // System: pinned horizontal showcase on desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', () => {
    const track = document.getElementById('systemTrack');
    const dist = () => track.scrollWidth - innerWidth;
    const hz = gsap.to(track, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.system', pin: true, start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: (s) => { document.getElementById('sysProgress').style.width = `${s.progress * 100}%`; } } });
    const inner = (card, targets, vars) => gsap.from(card.querySelectorAll(targets), { ...vars, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: card, containerAnimation: hz, start: 'left 75%', toggleActions: 'play none none reverse' } });
    const sc = gsap.utils.toArray('.sys-card');
    inner(sc[0], '.mc, .mc-meta', { y: 24, opacity: 0, scale: 0.9, stagger: 0.25, duration: 0.7 });
    inner(sc[1], '.deal', { y: -30, opacity: 0, stagger: 0.12, duration: 0.7 });
    inner(sc[2], '.pay-steps span, .pay-note', { scale: 0.6, opacity: 0, stagger: 0.2, duration: 0.6 });
    inner(sc[3], '.rev', { y: 40, rotation: -4, opacity: 0, duration: 1 });
  });

  // Video and booking: clip-path reveal
  gsap.from('.booking-wrap', { clipPath: 'inset(12% 12% 12% 12% round 40px)', duration: 1.4, ease: 'expo.out',
    scrollTrigger: { trigger: '.booking-wrap', start: 'top 85%' } });

  // How it works: line draws and steps light up
  const steps = [...document.querySelectorAll('.step')];
  gsap.to('#flowPath', { strokeDashoffset: 0, ease: 'none',
    scrollTrigger: { trigger: '.flow', start: 'top 75%', end: 'top 30%', scrub: true,
      onUpdate: (s) => steps.forEach((el, i) => el.classList.toggle('lit', s.progress >= i / (steps.length - 1) - 0.02)) } });

  // Booking card floats in with depth
  gsap.from('.booking', { y: 80, rotateX: 12, opacity: 0, duration: 1.4, ease: 'expo.out', transformPerspective: 1000,
    scrollTrigger: { trigger: '.booking-wrap', start: 'top 80%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
}

// Custom cursor: exact dot + trailing ring that reacts to what it is over
if (fine && !reduce) {
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
  document.body.append(dot, ring);
  const label = ring.querySelector('span');
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    document.documentElement.classList.add('has-cursor');
  });
  document.addEventListener('mouseleave', () => document.documentElement.classList.remove('has-cursor'));
  addEventListener('mousedown', () => ring.classList.add('down'));
  addEventListener('mouseup', () => ring.classList.remove('down'));
  const loop = () => {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  const state = (el) => {
    if (!el) return;
    const dk = !!el.closest('.dark, .video, .booking-wrap') && !el.closest('.btn-light');
    dot.classList.toggle('dk', dk); ring.classList.toggle('dk', dk);
    ring.classList.remove('hover', 'label'); dot.classList.remove('hide');
    const pinned = innerWidth > 980;
    if (el.closest('#videoBox')) { label.textContent = 'Play'; ring.classList.add('label'); dot.classList.add('hide'); }
    else if (el.closest('a, button, summary')) { ring.classList.add('hover'); dot.classList.add('hide'); }
    else if (pinned && el.closest('.sys-card')) { label.textContent = 'Scroll'; ring.classList.add('label'); dot.classList.add('hide'); }
  };
  document.addEventListener('mouseover', (ev) => state(ev.target));
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return; queued = true;
    requestAnimationFrame(() => { queued = false; state(document.elementFromPoint(mx, my)); });
  }, { passive: true });
}

// Hero: floating particles that drift upward and link when close
const cvs = document.getElementById('particles');
if (cvs && !reduce) {
  const ctx = cvs.getContext('2d');
  const hero = document.querySelector('.hero');
  let w, h, pts = [], running = true;
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, w * h / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, vx: (Math.random() - 0.5) * 0.15, vy: -(Math.random() * 0.35 + 0.08), a: Math.random() * 0.5 + 0.2 }));
  };
  size(); addEventListener('resize', size);
  new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(draw); }).observe(hero);
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 240, 196, ${p.a})`; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let k = i + 1; k < pts.length; k++) {
      const dx = pts[i].x - pts[k].x, dy = pts[i].y - pts[k].y, d = dx * dx + dy * dy;
      if (d < 9000) { ctx.strokeStyle = `rgba(94, 234, 168, ${0.12 * (1 - d / 9000)})`; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[k].x, pts[k].y); ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  }
}

// Hero: soft spotlight follows the cursor
const spot = document.getElementById('heroSpot');
if (spot && fine) {
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
    spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
  });
}

// Page-long scroll effects (the industries section keeps its own pinned animation)
if (hasGsap && !reduce) {
  gsap.to('#scrollProg', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // Hero: content and phone separate in depth as you scroll away
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-copy', { y: 140, opacity: 0.2, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-stage', { y: -60, scale: 0.94, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero .aurora', { scale: 1.25, ease: 'none', scrollTrigger: heroST });

  // Video poster drifts inside its frame
  gsap.fromTo('.video-poster .aurora', { yPercent: -10, scale: 1.2 }, { yPercent: 10, scale: 1.2, ease: 'none',
    scrollTrigger: { trigger: '#videoBox', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Section eyebrows slide in from the side
  gsap.utils.toArray('.section .eyebrow').forEach((el) => {
    if (el.closest('#industries')) return;
    gsap.from(el, { x: -30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // How it works steps rise in sequence
  gsap.utils.toArray('.step').forEach((s, i) => gsap.fromTo(s, { y: 60 }, { y: 0, ease: 'none',
    scrollTrigger: { trigger: '.flow', start: `top ${95 - i * 4}%`, end: 'top 45%', scrub: true } }));

  // Audit: copy and booking card move at different speeds
  gsap.matchMedia().add('(min-width: 701px)', () => {
    gsap.fromTo('.audit-copy', { y: 60 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '#audit', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.booking-wrap', { y: 120 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '#audit', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // FAQ rows cascade in
  gsap.from('.faq details', { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.faq', start: 'top 85%' } });

  // Final CTA grows into place, footer columns rise
  gsap.fromTo('.cta', { scale: 0.92, borderRadius: 64 }, { scale: 1, borderRadius: 40, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'top 35%', scrub: true } });
  gsap.from('.foot-grid > div', { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 92%' } });
}


// Homepage mini booking: pick a date and time, then continue to the audit form
(() => {
  const cal = document.getElementById('bkCal');
  if (!cal) return;
  const slots = [...document.querySelectorAll('#bkSlots button')];
  const book = document.getElementById('bkBook');
  const note = document.getElementById('bkNoteText');
  const month = document.getElementById('bkMonth');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  let day = null, time = null;
  cal.innerHTML = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => `<span class="dow">${d}</span>`).join('');
  for (let i = 0; i < 14; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = d.getDate();
    b.disabled = d < today || d.getDay() === 0;
    if (d.getTime() === today.getTime()) b.classList.add('today');
    b.setAttribute('aria-label', d.toDateString());
    b.addEventListener('click', () => { day = d; cal.querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b)); update(); });
    cal.appendChild(b);
  }
  const first = new Date(monday), last = new Date(monday); last.setDate(monday.getDate() + 13);
  const mName = (d) => d.toLocaleDateString(undefined, { month: 'long' });
  month.textContent = mName(first) === mName(last) ? `${mName(first)} ${first.getFullYear()}` : `${mName(first)} – ${mName(last)} ${last.getFullYear()}`;
  slots.forEach((b) => b.addEventListener('click', () => { time = b.dataset.t; slots.forEach((x) => x.classList.toggle('sel', x === b)); update(); }));
  function update() {
    if (day && time) {
      const label = `${day.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}, ${slots.find((s) => s.dataset.t === time).textContent}`;
      note.textContent = `${label} selected. Confirm it after a few quick questions.`;
      book.textContent = `Book ${label}`;
      book.classList.add('ready');
      const y = day.getFullYear(), m = String(day.getMonth() + 1).padStart(2, '0'), dd = String(day.getDate()).padStart(2, '0');
      try { localStorage.setItem('genleads-audit-pref', JSON.stringify({ date: `${y}-${m}-${dd}`, time, label })); } catch {}
    } else {
      note.textContent = day ? 'Now pick a time.' : 'Pick a date and time. Reminders are sent on WhatsApp.';
    }
  }
})();
