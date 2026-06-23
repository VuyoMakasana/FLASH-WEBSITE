/**
 * FLASH — navigation.js
 * Scroll nav styling, mobile menu, smooth scroll, active links.
 * Zero dependencies. Vanilla JS only.
 */

(function () {
  'use strict';

  var nav        = document.getElementById('main-nav');
  var toggle     = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('nav-mobile');
  var toggleIcon = document.getElementById('nav-toggle-icon');
  var menuOpen   = false;

  /* ── Scroll: .scrolled class ─────────────────────────── */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ─────────────────────────────────────── */
  function openMenu() {
    menuOpen = true;
    if (mobileMenu) mobileMenu.classList.add('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (toggleIcon) toggleIcon.innerHTML = iconX();
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (toggleIcon) toggleIcon.innerHTML = iconMenu();
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', function () {
    menuOpen ? closeMenu() : openMenu();
  });

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  document.addEventListener('click', function (e) {
    if (menuOpen && nav && !nav.contains(e.target)) closeMenu();
  });

  /* ── SVG icons ───────────────────────────────────────── */
  function iconMenu() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }
  function iconX() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  }
  if (toggleIcon) toggleIcon.innerHTML = iconMenu();

  /* ── Smooth scroll ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        closeMenu();
        var navHeight = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ── Active link highlighting ────────────────────────── */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    var linkPage = href.split('/').pop().split('#')[0];
    if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

})();
