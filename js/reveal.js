/* =============================================================
   SCROLL REVEAL
   A single, subtle entrance: elements marked [data-reveal] fade
   and rise a few pixels as they enter view. No layout shift,
   no stagger theatrics. Fully skipped when the visitor prefers
   reduced motion, and content is always visible without JS.
   ============================================================= */

(function () {
  'use strict';

  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Without support or with reduced motion, show everything as-is.
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Mark items as hidden only now (so no-JS visitors still see content).
  items.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  items.forEach((el) => observer.observe(el));
})();
