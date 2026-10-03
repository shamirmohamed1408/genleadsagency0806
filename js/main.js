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

// Industries: build cards for the scroll morph
const INDUSTRIES = [
  ['Real Estate', 'M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6'],
  ['Property Management', 'M4 21V5h10v16M14 9h6v12M7 9h3M7 13h3M7 17h3'],
  ['Resorts', 'M3 20h18M12 4c3 3 3 7 0 10M12 4C9 7 9 11 12 14M12 14v6M5 20c0-3 3-5 7-6'],
  ['Hospitality', 'M3 18h18M5 18a7 7 0 0 1 14 0M12 8V6M10 6h4'],
  ['Clinics', 'M12 5v14M5 12h14'],
  ['Dental', 'M7 4c-2 0-3 2-3 4 0 4 2 5 2 9 0 2 1 3 2 3s1-3 2-5c1 2 1 5 2 5s2-1 2-3c0-4 2-5 2-9 0-2-1-4-3-4-2 0-2 1-4 1S9 4 7 4z'],
  ['Salons & Spas', 'M6 6a3 3 0 1 0 0 .1M6 18a3 3 0 1 0 0 .1M8.5 7.5 20 18M8.5 16.5 20 6'],
  ['Software', 'm8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14'],
  ['Restaurants', 'M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 2-2 6 0 8v10'],
  ['E-commerce', 'M3 4h3l2 12h11l2-8H7M10 20a1 1 0 1 0 0 .1M18 20a1 1 0 1 0 0 .1'],
  ['Education', 'm2 9 10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5'],
  ['Automotive', 'M5 16h14M3 16l2-6h14l2 6v3H3zM7 19v1M17 19v1'],
  ['Gyms & Fitness', 'M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12'],
  ['Professional Services', 'M4 8h16v11H4zM9 8V5h6v3M4 13h16'],
];
const COLORS = ['#0A7D4F', '#05231A', '#0FA968', '#1E6B8F', '#0C5A3A', '#137F6B', '#2F8F5B'];
const morphCards = document.getElementById('morphCards');
if (morphCards) {
  const PHOTOS = ["real-estate","property-management","resorts","hospitality","clinics","dental","salons","software","restaurants","ecommerce","education","automotive","gyms","professional"];
  morphCards.innerHTML = INDUSTRIES.map(([name, d], i) =>
    `<div class="mcard"><img src="/images/industries/${PHOTOS[i]}.webp" alt="${name} business using GenLeads automation" width="600" height="750" loading="lazy" decoding="async"><span class="mcard-ico"><svg viewBox="0 0 24 24"><path d="${d}"/></svg></span><b>${name}</b></div>`).join('');
}

// Nav: solid on scroll, dark variant over dark sections
const nav = document.getElementById('nav');
let navScrolled = null;
const updateNav = () => {
  const s = scrollY > 20;
  if (s !== navScrolled) { navScrolled = s; nav.classList.toggle('scrolled', s); }
};
addEventListener('scroll', updateNav, { passive: true });
updateNav();
// Dark-section detection without hit-testing: watch a 2px line just under the nav bar
(() => {
  const under = new Set();
  let io;
  const watch = () => {
    if (io) io.disconnect();
    under.clear();
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
      nav.classList.toggle('on-dark', under.size > 0);
    }, { rootMargin: `-79px 0px -${Math.max(0, innerHeight - 81)}px 0px` });
    document.querySelectorAll('.dark').forEach((el) => io.observe(el));
  };
  watch();
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(watch, 200); });
})();

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
  if (window.Lenis && window.GL_PERF && GL_PERF.glide) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    window.glLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    lenis.on('destroy', () => gsap.ticker.remove(raf));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -72 }); }
    }));
  }

  const splitWords = (el) => (window.SplitText ? new SplitText(el, { type: 'words', wordsClass: 'word', aria: 'none' }).words : [el]);

  // Hero intro
  const heroWords = [...splitWords(document.querySelector('.h1-static')), document.querySelector('.rotator')];
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.badge', { y: 20, opacity: 0, duration: 1 })
    .from(heroWords, { yPercent: 110, opacity: 0, rotate: 4, duration: 1.2, stagger: 0.06 }, '-=0.7')
    .from('.hero .fade-up', { y: 30, duration: 1, stagger: 0.12 }, '-=0.9')
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

  // Industries: cards scatter, line up, form a circle, then fan into an arc as you scroll
  mm.add('all', () => {
    const box = document.getElementById('morph');
    const cards = gsap.utils.toArray('.mcard');
    const N = cards.length;
    const W = () => box.clientWidth, H = () => box.clientHeight;
    const rnd = cards.map(() => [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
    const mob = () => W() < 700;
    const arcAt = (t) => {
      const R = mob() ? W() * 1.5 : W() * 0.95;
      // phones: space cards by their own width so only a few show at once and the rest wait off-screen
      const full = mob() ? N * 108 / R * 180 / Math.PI : 2 * Math.asin(Math.min(0.95, (W() * 0.6) / R)) * 180 / Math.PI * N / (N - 1);
      const a = (-90 - full / 2 + t * full) * Math.PI / 180;
      return { x: Math.cos(a) * R, y: Math.sin(a) * R + H() * (mob() ? 0.1 : 0.2) + R, r: a * 180 / Math.PI + 90 };
    };
    gsap.set(cards, { x: (i) => rnd[i][0] * W() * 1.2, y: (i) => rnd[i][1] * H() * 1.2, rotation: (i) => rnd[i][2] * 180, scale: 0.6, opacity: 0 });
    gsap.set('.morph-head', { opacity: 0, y: 30 });
    gsap.set('.morph-intro', { opacity: 0 });
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' },
      scrollTrigger: { trigger: box, pin: true, start: 'top top', end: () => (mob() ? '+=2000' : '+=2800'), scrub: 1, invalidateOnRefresh: true } });
    tl.to(cards, { x: (i) => (i - (N - 1) / 2) * Math.min(132, W() * 0.92 / N), y: 0, rotation: 0, scale: 0.75, opacity: 1, duration: 1, stagger: 0.02 })
      .to(cards, { x: (i) => Math.cos(i / N * Math.PI * 2) * (mob() ? W() * 0.42 : Math.min(W() * 0.32, 520)), y: (i) => Math.sin(i / N * Math.PI * 2) * (mob() ? W() * 0.42 : H() * 0.38),
        rotation: (i) => i / N * 360 + 90, scale: () => (mob() ? 0.5 : 0.7), duration: 1 })
      .to('.morph-intro', { opacity: 1, duration: 0.5 }, '<0.4')
      .to('.morph-intro', { opacity: 0, duration: 0.4 }, '+=0.4')
      .to(cards, { x: (i) => arcAt(i / N + 0.5 / N).x, y: (i) => arcAt(i / N + 0.5 / N).y, rotation: (i) => arcAt(i / N + 0.5 / N).r, scale: () => (mob() ? 0.85 : 0.9), duration: 1.2 }, '<')
      .to('.morph-head', { opacity: 1, y: 0, duration: 0.6 }, '<0.6')
      .to({}, { duration: 0.3 });

    // Once the arc has formed, keep the cards travelling around it like a slow wheel
    let offset = 0, spinning = false, visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);
    const setters = cards.map((c) => ({ x: gsap.quickSetter(c, 'x', 'px'), y: gsap.quickSetter(c, 'y', 'px'), r: gsap.quickSetter(c, 'rotation', 'deg'), o: gsap.quickSetter(c, 'opacity') }));
    const spin = (time, dt) => {
      if (!visible) return;
      offset = (offset + dt * 0.000018) % 1;
      cards.forEach((c, i) => {
        const t = (i / N + 0.5 / N + offset) % 1;
        const pos = arcAt(t);
        setters[i].x(pos.x); setters[i].y(pos.y); setters[i].r(pos.r);
        setters[i].o(Math.min(1, Math.min(t, 1 - t) * 10));
      });
    };
    tl.eventCallback('onUpdate', () => {
      const on = tl.progress() > 0.985;
      if (on && !spinning) { spinning = true; offset = 0; gsap.ticker.add(spin); }
      if (!on && spinning) { spinning = false; gsap.ticker.remove(spin); }
    });
    const onMove = (e) => gsap.to('.morph-cards', { x: (e.clientX / innerWidth - 0.5) * 60, duration: 1.2, ease: 'power3.out' });
    box.addEventListener('mousemove', onMove);
    return () => box.removeEventListener('mousemove', onMove);
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
  let looping = false;
  const loop = () => {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    if (Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2) requestAnimationFrame(loop); else looping = false;
  };
  addEventListener('mousemove', () => { if (!looping) { looping = true; requestAnimationFrame(loop); } }, { passive: true });
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
  let lastHit = 0, hitTimer;
  const hit = () => { lastHit = performance.now(); state(document.elementFromPoint(mx, my)); };
  addEventListener('scroll', () => {
    if (!document.documentElement.classList.contains('has-cursor')) return;
    clearTimeout(hitTimer); hitTimer = setTimeout(hit, 120);
    if (performance.now() - lastHit > 250) hit();
  }, { passive: true });
}

// Hero: floating particles that drift upward and link when close
const cvs = document.getElementById('particles');
if (cvs && !reduce) {
  const ctx = cvs.getContext('2d');
  const hero = document.querySelector('.hero');
  let w, h, pts = [], running = true;
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = hero.clientWidth; h = hero.clientHeight;
    cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, w * h / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, vx: (Math.random() - 0.5) * 0.15, vy: -(Math.random() * 0.35 + 0.08), a: Math.random() * 0.5 + 0.2 }));
  };
  // Start after the page has loaded so the particles never delay the first paint
  const start = () => { size(); addEventListener('resize', size); new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(draw); }).observe(hero); };
  const later = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 600));
  if (document.readyState === 'complete') later(); else addEventListener('load', later);
  function draw() {
    if (!running || document.documentElement.classList.contains('lite')) { running = false; return; }
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 240, 196, ${p.a})`; ctx.fill();
    }
    ctx.lineWidth = 0.6;
    for (let i = 0; i < pts.length; i++) for (let k = i + 1; k < pts.length; k++) {
      const dx = pts[i].x - pts[k].x; if (dx > 95 || dx < -95) continue;
      const dy = pts[i].y - pts[k].y; if (dy > 95 || dy < -95) continue;
      const d = dx * dx + dy * dy;
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
    spot.style.transform = `translate3d(${e.clientX - r.left - 600}px, ${e.clientY - r.top - 600}px, 0)`;
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
