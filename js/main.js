/**
 * FLASH — main.js
 * Site-wide initialisation. Zero dependencies. Vanilla JS only.
 */

(function () {
  'use strict';

  /* ── Current year in footer ─────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── External link safety ───────────────────────────── */
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    if (!link.getAttribute('target')) link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  /* ── Focus trap in mobile menu (a11y) ──────────────── */
  var mobileMenu = document.getElementById('nav-mobile');
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', function (e) {
      if (!mobileMenu.classList.contains('open')) return;
      var focusables = mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last  = focusables[focusables.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* ── Image error fallback ───────────────────────────── */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () { this.src = this.dataset.fallback; });
  });

  /* ── Accessible live region ─────────────────────────── */
  var liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'live-region';
  document.body.appendChild(liveRegion);

  window.flashAnnounce = function (msg) {
    liveRegion.textContent = '';
    requestAnimationFrame(function () { liveRegion.textContent = msg; });
  };

})();
