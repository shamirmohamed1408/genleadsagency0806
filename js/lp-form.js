// Ad landing page form: qualifies the lead. Ad budget of ₹10,000 or more continues to /book; under ₹10,000 gets a polite close.
const WEBHOOK_URL = 'https://n8n.genleadsagency.com/webhook/genleads-website-audit'; // n8n webhook: receives every submission (qualified or not) as JSON

const form = document.getElementById('lpForm');
const steps = [...form.querySelectorAll('fieldset.step')];
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const errorEl = document.getElementById('formError');
const DRAFT_KEY = 'genleads-lp-draft';
const LEAD_KEY = 'genleads-audit-lead'; // same key /book already reads
const CALC_KEY = 'genleads-lp-calc';
const NEXT = document.body.dataset.next || ''; // optional page to continue to after submit
const SEND_LABEL = nextBtn.textContent;
let current = 0;

const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

// Show the visitor their own estimate from the calculator
const calc = store.get(CALC_KEY);
if (calc && calc.perMonth > 0 && document.getElementById('estCard')) {
  document.getElementById('estNum').textContent = inr(calc.perMonth);
  document.getElementById('estCard').hidden = false;
}

const siteField = document.getElementById('siteField');
const adField = document.getElementById('adBudgetField');
const syncAds = () => {
  if (!adField) return;
  const na = form.querySelector('.chips[data-name="needAds"]');
  adField.hidden = !(na && chipValue(na)[0] === 'Yes');
};
const syncSite = () => {
  const hw = form.querySelector('.chips[data-name="hasWebsite"]');
  if (!hw) return;
  const v = chipValue(hw)[0] || '';
  siteField.hidden = !(v === 'Yes' || v === 'Yes, but it needs a rebrand');
};

document.querySelectorAll('.chips').forEach((group) => {
  group.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (group.classList.contains('multi')) b.classList.toggle('on');
    else group.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    group.classList.remove('invalid');
    errorEl.textContent = '';
    syncSite();
    syncAds();
    saveDraft();
  });
});
function chipValue(g) { return [...g.querySelectorAll('button.on')].map((b) => b.textContent.trim()); }

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
  syncSite();
  syncAds();
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
    if (g.closest('[hidden]')) return;
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
  const bar = document.getElementById('bar');
  if (bar) bar.style.width = pct + '%';
  const pctEl = document.getElementById('stepPct');
  if (pctEl) pctEl.textContent = pct + '%';
  const label = document.getElementById('stepLabel');
  if (label) label.textContent = `Step ${current + 1} of ${steps.length} · ${s.dataset.title}`;
  backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
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

async function submit() {
  const d = collect();
  // Bots fill the hidden field: pretend it worked and send nothing
  if (d.hp) { store.del(DRAFT_KEY); document.getElementById('formView').hidden = true; document.getElementById('softView').hidden = false; return; }
  delete d.hp;
  const qualified = d.adBudget !== 'Under ₹10,000';
  const lead = {
    ...d,
    qualified,
    tier: qualified ? (calc && calc.perMonth >= 10000 ? 'hot' : 'warm') : 'cold',
    calculator: calc || null,
    stage: qualified ? 'form_completed' : 'budget_not_a_fit',
    visitorTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    source: 'genleadsagency.com' + location.pathname,
    submittedAt: new Date().toISOString(),
  };
  nextBtn.disabled = true;
  nextBtn.textContent = 'Saving…';
  if (WEBHOOK_URL) {
    try {
      const res = await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!res.ok) throw new Error(res.status);
    } catch {
      nextBtn.disabled = false;
      nextBtn.textContent = SEND_LABEL;
      errorEl.textContent = "We couldn't save your details. Check your connection and try again, or message us on WhatsApp.";
      return;
    }
  }
  store.del(DRAFT_KEY);
  if (typeof gtag === 'function') gtag('event', qualified ? 'generate_lead' : 'lead_not_qualified', { form: lead.source });
  if (NEXT || qualified) store.set(LEAD_KEY, lead);
  if (qualified && typeof fbq === 'function') fbq('track', 'Lead');
  // Pages with data-next send the visitor to a page instead of WhatsApp (they book themselves)
  if (NEXT) { location.href = NEXT; return; }
  const problems = d.problems && d.problems.length ? d.problems.join(', ') : 'your services';
  const adLine = d.needAds === 'Yes' ? `My monthly ad budget is ${d.adBudget}.` : "I don't need advertising right now.";
  const text = `Hi GenLeads, I'm ${d.name} from ${d.business}. I'm interested in ${problems}. ${adLine}`;
  location.href = 'https://wa.me/919442666986?text=' + encodeURIComponent(text);
}

loadDraft();
// "Get my website reviewed" link: start with the rebrand option chosen
if (new URLSearchParams(location.search).get('need') === 'review' && form.querySelector('.chips[data-name="hasWebsite"]')) {
  const g = form.querySelector('.chips[data-name="hasWebsite"]');
  g.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent.trim() === 'Yes, but it needs a rebrand'));
  syncSite();
}
show(current);
