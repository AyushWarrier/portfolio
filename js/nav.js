/* =============================================================
   NAVIGATION
   Three quiet behaviours:
   1. A hairline border appears once the page is scrolled.
   2. The mobile menu toggles open/closed (accessible).
   3. Scroll-spy marks the current section in the nav.
   All progressive enhancement — the page works without JS.
   ============================================================= */

(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('.nav__links');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));

  /* --- 1. Scrolled state ----------------------------------- */
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- 2. Mobile menu -------------------------------------- */
  if (toggle && links) {
    let lastFocused = null;

    const getFocusable = () =>
      Array.from(links.querySelectorAll('a, button')).filter(
        (el) => el.offsetParent !== null
      );

    // While open, Tab/Shift+Tab cycle within the drawer instead of
    // escaping into the page content behind it.
    const trapKeydown = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const setOpen = (open) => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

      // Lock background scroll while the drawer covers the page.
      document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        lastFocused = document.activeElement;
        document.addEventListener('keydown', trapKeydown);
        const focusable = getFocusable();
        if (focusable.length) focusable[0].focus();
      } else {
        document.removeEventListener('keydown', trapKeydown);
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
        lastFocused = null;
      }
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a destination
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
      }
    });

    // Reset when leaving the mobile breakpoint
    const mq = window.matchMedia('(min-width: 721px)');
    mq.addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* --- 3. Scroll-spy --------------------------------------- */
  // Map each nav link to the section it targets.
  const spyTargets = navLinks
    .map((link) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#') || id === '#') return null;
      const section = document.querySelector(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (spyTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = spyTargets.find((t) => t.section === entry.target);
          if (!match) return;
          navLinks.forEach((l) => l.classList.remove('is-active'));
          match.link.classList.add('is-active');
        });
      },
      // Trigger around the upper third of the viewport
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    spyTargets.forEach((t) => observer.observe(t.section));
  }
})();
