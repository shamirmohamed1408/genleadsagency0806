// Free audit, page 1 of 2: qualifying form. On submit the answers go to n8n and the visitor moves to /book.
const WEBHOOK_URL = ''; // n8n webhook: receives every qualified lead as JSON

const form = document.getElementById('auditForm');
const steps = [...form.querySelectorAll('fieldset.step')];
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const errorEl = document.getElementById('formError');
const DRAFT_KEY = 'genleads-audit-draft';
const LEAD_KEY = 'genleads-audit-lead';
let current = 0;

const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

document.querySelectorAll('.chips').forEach((group) => {
  group.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (group.classList.contains('multi')) b.classList.toggle('on');
    else group.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    group.classList.remove('invalid');
    errorEl.textContent = '';
    saveDraft();
  });
});
const chipValue = (g) => [...g.querySelectorAll('button.on')].map((b) => b.textContent.trim());

function collect() {
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach((el) => { data[el.name] = el.value.trim(); });
  form.querySelectorAll('.chips').forEach((g) => {
    const v = chipValue(g);
    data[g.dataset.name] = g.classList.contains('multi') ? v : (v[0] || '');
  });
  return data;
}
function saveDraft() { store.set(DRAFT_KEY, { data: collect(), step: current }); }
function loadDraft() {
  const saved = store.get(DRAFT_KEY);
  if (!saved) return;
  Object.entries(saved.data || {}).forEach(([k, v]) => {
    const el = form.elements[k];
    if (el && typeof v === 'string') { el.value = v; return; }
    const g = form.querySelector(`.chips[data-name="${k}"]`);
    if (g) g.querySelectorAll('button').forEach((b) => b.classList.toggle('on', [].concat(v).includes(b.textContent.trim())));
  });
  if (saved.step > 0 && saved.step < steps.length) show(saved.step);
}
form.addEventListener('input', (e) => { e.target.classList.remove('invalid'); errorEl.textContent = ''; saveDraft(); });

function validate(i) {
  const step = steps[i];
  let ok = true;
  step.querySelectorAll('input[required], select[required]').forEach((el) => {
    const bad = !el.value.trim() || !el.checkValidity();
    el.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  step.querySelectorAll('.chips[data-required]').forEach((g) => {
    const bad = chipValue(g).length === 0;
    g.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) {
    const first = step.querySelector('.invalid');
    errorEl.textContent = first && first.type === 'tel' && first.value ? 'Enter a valid WhatsApp number, with country code.'
      : first && first.type === 'email' && first.value ? 'Enter a valid email address.' : 'Fill in the highlighted fields to continue.';
    if (first && first.focus) first.focus();
  }
  return ok;
}

function show(i, dir = 1) {
  steps[current].classList.remove('active', 'back-in');
  current = i;
  const s = steps[current];
  s.classList.add('active');
  s.classList.toggle('back-in', dir < 0);
  const pct = Math.round(((current + 1) / steps.length) * 100);
  document.getElementById('bar').style.width = pct + '%';
  document.getElementById('stepPct').textContent = pct + '%';
  document.getElementById('stepLabel').textContent = `Step ${current + 1} of ${steps.length} · ${s.dataset.title}`;
  backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
  nextBtn.textContent = current === steps.length - 1 ? 'Continue to booking' : 'Continue';
  errorEl.textContent = '';
  const field = s.querySelector('input, select');
  if (field && matchMedia('(pointer: fine)').matches) field.focus({ preventScroll: true });
}

nextBtn.addEventListener('click', () => {
  if (!validate(current)) return;
  if (current < steps.length - 1) { show(current + 1); saveDraft(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  else submit();
});
backBtn.addEventListener('click', () => current > 0 && show(current - 1, -1));
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); nextBtn.click(); }
});

// Lead score from revenue, enquiry volume and urgency: 0 to 9, 6+ is hot
function score() {
  const pts = (name) => { const b = form.querySelector(`.chips[data-name="${name}"] button.on`); return b ? +(b.dataset.score || 0) : 0; };
  const s = pts('revenue') + pts('leads') + pts('timeline');
  return { score: s, tier: s >= 6 ? 'hot' : s >= 3 ? 'warm' : 'cold' };
}

async function submit() {
  const lead = { ...collect(), ...score(), stage: 'form_completed', visitorTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, source: 'genleadsagency.com/audit', submittedAt: new Date().toISOString() };
  nextBtn.disabled = true;
  nextBtn.textContent = 'Saving…';
  if (WEBHOOK_URL) {
    try {
      const res = await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!res.ok) throw new Error(res.status);
    } catch {
      nextBtn.disabled = false;
      nextBtn.textContent = 'Continue to booking';
      errorEl.textContent = "We couldn't save your details. Check your connection and try again, or message us on WhatsApp.";
      return;
    }
  }
  store.set(LEAD_KEY, lead);
  store.del(DRAFT_KEY);
  location.href = 'book.html';
}

loadDraft();
show(current);
