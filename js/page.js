// Shared behaviour for inner pages (service, about, contact, legal)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

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

if (window.gsap && window.ScrollTrigger && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && window.GL_PERF && GL_PERF.glide) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    window.glLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    lenis.on('destroy', () => gsap.ticker.remove(raf));
    gsap.ticker.lagSmoothing(0);
  }
  gsap.to('#scrollProg', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  gsap.from('.p-hero .rv', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 });
  ScrollTrigger.batch('main .section .rv', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
  });
  gsap.utils.toArray('.section .eyebrow').forEach((el) => gsap.from(el, { x: -24, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
  gsap.from('.faq details', { y: 30, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.faq', start: 'top 85%' } });
  gsap.fromTo('.cta', { scale: 0.93 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'top 40%', scrub: true } });
  addEventListener('load', () => ScrollTrigger.refresh());
}

// Custom cursor (mouse only)
if (fine && !reduce) {
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
  document.body.append(dot, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; document.documentElement.classList.add('has-cursor'); });
  document.addEventListener('mouseleave', () => document.documentElement.classList.remove('has-cursor'));
  addEventListener('mousedown', () => ring.classList.add('down'));
  addEventListener('mouseup', () => ring.classList.remove('down'));
  let looping = false;
  const loop = () => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px, ${ry}px)`; if (Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2) requestAnimationFrame(loop); else looping = false; };
  addEventListener('mousemove', () => { if (!looping) { looping = true; requestAnimationFrame(loop); } }, { passive: true });
  const state = (el) => {
    if (!el) return;
    const dk = !!el.closest('.dark') && !el.closest('.btn-light');
    dot.classList.toggle('dk', dk); ring.classList.toggle('dk', dk);
    const link = !!el.closest('a, button, summary');
    ring.classList.toggle('hover', link); dot.classList.toggle('hide', link);
  };
  document.addEventListener('mouseover', (e) => state(e.target));
  let lastHit = 0, hitTimer;
  const hit = () => { lastHit = performance.now(); state(document.elementFromPoint(mx, my)); };
  addEventListener('scroll', () => {
    if (!document.documentElement.classList.contains('has-cursor')) return;
    clearTimeout(hitTimer); hitTimer = setTimeout(hit, 120);
    if (performance.now() - lastHit > 250) hit();
  }, { passive: true });
}

// Rotating headline line
const rots = [...document.querySelectorAll('.rot')];
if (rots.length > 1 && !reduce) {
  let cur = 0;
  setInterval(() => {
    const prev = rots[cur];
    prev.classList.remove('on'); prev.classList.add('out');
    setTimeout(() => prev.classList.remove('out'), 900);
    cur = (cur + 1) % rots.length;
    rots[cur].classList.add('on');
  }, 2600);
}

// Card spotlight follows the cursor
document.querySelectorAll('.spot').forEach((card) => card.addEventListener('pointermove', (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}));
