/**
 * FLASH — animations.js
 * Scroll-triggered reveals via IntersectionObserver.
 * Respects prefers-reduced-motion. Zero dependencies.
 */

(function () {
  'use strict';

  /* ── Reduced motion ──────────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up, .fade-in').forEach(function (el) {
      el.classList.add('in-view');
    });
    return;
  }

  /* ── Scroll reveal ───────────────────────────────────── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  function initObservers() {
    document.querySelectorAll('.fade-up, .fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Music player show after hero ───────────────────── */
  var musicPlayer = document.getElementById('music-player');
  if (musicPlayer) {
    var hero = document.getElementById('hero');
    if (hero) {
      var musicObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          musicPlayer.classList.toggle('visible', !entry.isIntersecting);
        });
      }, { threshold: 0.1 });
      musicObs.observe(hero);
    }
  }

  /* ── FAQ accordion ───────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Init ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initObservers();
      initFAQ();
    });
  } else {
    initObservers();
    initFAQ();
  }

})();
