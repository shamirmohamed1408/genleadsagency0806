// Footer signup: hands the email to WhatsApp so the request reaches a real inbox
(() => {
  const form = document.getElementById('newsForm');
  if (!form) return;
  const input = document.getElementById('newsEmail');
  const msg = document.getElementById('newsMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity() || !input.value.trim()) { msg.textContent = 'Enter a valid email address.'; input.focus(); return; }
    const text = encodeURIComponent(`Hi GenLeads, please add me to your updates: ${input.value.trim()}`);
    window.open(`https://wa.me/918667480588?text=${text}`, '_blank', 'noopener');
    msg.textContent = 'Opening WhatsApp to confirm your signup.';
  });
})();
