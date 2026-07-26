/* =============================================================
   MAIN
   Small page-level touches that don't belong to a feature.
   ============================================================= */

(function () {
  'use strict';

  // --- Copy email + toast ------------------------------------
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const toast = document.querySelector('[data-toast]');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
  }

  // The email can be copied from more than one place (hero + footer).
  copyButtons.forEach((copyBtn) => {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-copy-email');
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied');
      } catch (err) {
        showToast('Could not copy — ' + email);
      }
    });
  });
})();
