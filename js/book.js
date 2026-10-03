// Free audit, page 2 of 3: Cal.com booking calendar, prefilled with the visitor's form answers.
// Set CAL_LINK to your Cal.com event, e.g. 'genleads/free-audit' (from cal.com/genleads/free-audit).
const CAL_LINK = 'shamir-lnu-8gxzdh/audit';
const LEAD_KEY = 'genleads-audit-lead';
const BOOKING_KEY = 'genleads-audit-booking';

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const lead = read(LEAD_KEY) || {};
const pref = read('genleads-audit-pref');
const first = (lead.name || '').split(' ')[0];

// Left panel: personalise from the form
if (first) document.getElementById('hiName').textContent = `Thanks, ${first}.`;
if (lead.business) {
  document.getElementById('sumBusiness').textContent = lead.business;
  document.getElementById('sumIndustry').textContent = lead.industry || '—';
  document.getElementById('sumFocus').textContent = (lead.problems || []).slice(0, 2).join(', ') || 'Where you are losing leads';
  document.getElementById('summary').hidden = false;
}

if (pref && pref.label) {
  const lead2 = document.querySelector('.side-lead');
  if (lead2) lead2.textContent = `You picked ${pref.label}. Confirm that slot on the calendar, or choose another. You will get a Google Meet link and WhatsApp confirmation straight away.`;
}

// WhatsApp fallback carries their details so nothing has to be retyped
const waText = lead.name
  ? `Hi GenLeads, I'd like to book my free audit. I'm ${lead.name} from ${lead.business || 'my business'}. Email: ${lead.email || ''}`
  : "Hi GenLeads, I'd like to book a free business audit.";
document.getElementById('waBook').href = `https://wa.me/918667480588?text=${encodeURIComponent(waText)}`;

const loading = document.getElementById('calLoading');
const fallback = document.getElementById('calFallback');
const showFallback = () => { loading.hidden = true; fallback.hidden = false; };

function goConfirmed(detail) {
  const d = detail && (detail.data || detail);
  const start = d && (d.startTime || d.date || (d.booking && d.booking.startTime));
  write(BOOKING_KEY, { name: lead.name || '', business: lead.business || '', email: lead.email || '', start: start || null });
  location.href = '/thank-you';
}

if (!CAL_LINK) {
  showFallback();
} else {
  /* Cal.com embed loader (from cal.com/docs embed snippet) */
  (function (C, A, L) { const p = function (a, ar) { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal; const ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');

  const notes = [lead.business && `Business: ${lead.business}`, lead.site && `Site/IG: ${lead.site}`, lead.industry && `Industry: ${lead.industry}`,
    lead.problems && lead.problems.length && `Focus: ${lead.problems.join(', ')}`, lead.tier && `Lead score: ${lead.tier}`].filter(Boolean).join('\n');

  Cal('init', 'audit', { origin: 'https://cal.com' });
  Cal.ns.audit('inline', {
    elementOrSelector: '#cal',
    calLink: pref && pref.date ? `${CAL_LINK}?month=${pref.date.slice(0, 7)}&date=${pref.date}` : CAL_LINK,
    layout: 'month_view',
    config: { name: lead.name || '', email: lead.email || '', notes, whatsapp: lead.whatsapp || '', attendeePhoneNumber: lead.whatsapp || '', theme: 'light' },
  });
  Cal.ns.audit('ui', { theme: 'light', hideEventTypeDetails: false, layout: 'month_view', cssVarsPerTheme: { light: { 'cal-brand': '#0A7D4F' } } });
  Cal.ns.audit('on', { action: 'linkReady', callback: () => { loading.hidden = true; } });
  Cal.ns.audit('on', { action: 'bookingSuccessfulV2', callback: (e) => goConfirmed(e.detail) });
  Cal.ns.audit('on', { action: 'bookingSuccessful', callback: (e) => goConfirmed(e.detail) });

  // If the calendar can't load (blocked network, wrong link), offer WhatsApp instead
  setTimeout(() => { if (!loading.hidden) showFallback(); }, 12000);
}
