const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  // System: on desktop one card at a time, advancing every 3 seconds
  const mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', () => {
    const track = document.getElementById('systemTrack');
    const vp = track.parentElement;
    const bar = document.getElementById('sysProgress');
    const cards = gsap.utils.toArray('.sys-card');
    const reveals = [
      (c) => gsap.from(c.querySelectorAll('.mc, .mc-meta'), { y: 24, opacity: 0, scale: 0.9, stagger: 0.25, duration: 0.7, ease: 'back.out(1.6)' }),
      (c) => gsap.from(c.querySelectorAll('.deal'), { y: -30, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'back.out(1.6)' }),
      (c) => gsap.from(c.querySelectorAll('.pay-steps span, .pay-note'), { scale: 0.6, opacity: 0, stagger: 0.2, duration: 0.6, ease: 'back.out(1.6)' }),
      (c) => gsap.from(c.querySelectorAll('.rev'), { y: 40, rotation: -4, opacity: 0, duration: 1, ease: 'back.out(1.6)' }),
    ];
    let i = 0;
    let timer = null;
    const show = (n) => {
      i = n;
      const c = cards[i];
      gsap.to(track, { x: vp.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2), duration: 1, ease: 'expo.inOut' });
      gsap.to(bar, { width: `${((i + 1) / cards.length) * 100}%`, duration: 0.6 });
      reveals[i](c);
    };
    const start = () => { if (!timer) timer = setInterval(() => show((i + 1) % cards.length), 3000); };
    const stop = () => { clearInterval(timer); timer = null; };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.4 });
    io.observe(vp);
    show(0);
    return () => {
      stop();
      io.disconnect();
      gsap.killTweensOf([track, bar]);
      gsap.set([track, bar], { clearProps: 'all' });
    };
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

// Page-long scroll effects (the industries section keeps its own pinned animation)
if (hasGsap && !reduce) {
  gsap.to('#scrollProg', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // Hero: content and phone separate in depth as you scroll away
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-copy', { y: 140, opacity: 0.2, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-stage', { y: -60, scale: 0.94, ease: 'none', scrollTrigger: heroST });

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
