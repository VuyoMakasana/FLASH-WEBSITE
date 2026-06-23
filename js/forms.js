/**
 * FLASH — forms.js
 * Music player with localStorage persistence, contact form handling.
 * Zero dependencies. Vanilla JS only.
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     MUSIC PLAYER — full cross-browser implementation
  ══════════════════════════════════════════════════════ */
  var audio      = document.getElementById('bg-audio');
  var playBtn    = document.getElementById('music-play-btn');
  var volSlider  = document.getElementById('music-vol');
  var statusDot  = document.querySelector('.music-player__status');
  var playing    = false;
  var STORAGE_KEY_VOL   = 'flash_music_vol';
  var STORAGE_KEY_MUTED = 'flash_music_muted';

  function getStoredVol() {
    try { return parseFloat(localStorage.getItem(STORAGE_KEY_VOL) || '0.15'); }
    catch (e) { return 0.15; }
  }
  function setStoredVol(v) {
    try { localStorage.setItem(STORAGE_KEY_VOL, v); } catch (e) {}
  }
  function getStoredMuted() {
    try { return localStorage.getItem(STORAGE_KEY_MUTED) === 'true'; } catch (e) { return false; }
  }
  function setStoredMuted(v) {
    try { localStorage.setItem(STORAGE_KEY_MUTED, v ? 'true' : 'false'); } catch (e) {}
  }

  function syncPlayButton() {
    if (!playBtn) return;
    if (playing) {
      playBtn.classList.remove('music-player__btn--idle');
      playBtn.classList.add('music-player__btn--playing');
      playBtn.innerHTML = iconPause();
      playBtn.setAttribute('aria-label', 'Pause background music');
      if (statusDot) statusDot.classList.add('playing');
    } else {
      playBtn.classList.add('music-player__btn--idle');
      playBtn.classList.remove('music-player__btn--playing');
      playBtn.innerHTML = iconPlay();
      playBtn.setAttribute('aria-label', 'Play background music');
      if (statusDot) statusDot.classList.remove('playing');
    }
  }

  if (audio) {
    // Restore volume
    var storedVol = getStoredVol();
    audio.volume = storedVol;
    audio.muted  = getStoredMuted();
    if (volSlider) volSlider.value = Math.round(storedVol * 100);

    // Audio events
    audio.addEventListener('ended',  function () { playing = false; syncPlayButton(); });
    audio.addEventListener('pause',  function () { playing = false; syncPlayButton(); });
    audio.addEventListener('play',   function () { playing = true;  syncPlayButton(); });
    audio.addEventListener('error',  function () {
      // Silently fail — hide the player button on error
      playing = false;
      syncPlayButton();
      console.warn('Flash: background audio unavailable.');
    });

    // Handle autoplay policy gracefully
    // Do NOT autoplay — wait for user gesture
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (!audio) return;
        if (playing) {
          audio.pause();
        } else {
          var playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(function () {
              // Browser blocked autoplay — show helpful state
              playing = false;
              syncPlayButton();
              if (window.flashAnnounce) {
                window.flashAnnounce('Tap Play to start background music.');
              }
            });
          }
        }
        // Note: playing state is updated by the play/pause events above
      });
    }
  }

  if (volSlider && audio) {
    volSlider.addEventListener('input', function () {
      var vol = parseInt(this.value, 10) / 100;
      audio.volume = vol;
      audio.muted  = (vol === 0);
      setStoredVol(vol);
      setStoredMuted(vol === 0);
    });
  }

  function iconPlay() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>';
  }
  function iconPause() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
  }
  if (playBtn) syncPlayButton();


  /* ══════════════════════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════════════════════ */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(this);

      var name    = getVal('cf-name');
      var email   = getVal('cf-email');
      var subject = getVal('cf-subject') || 'Flash enquiry';
      var message = getVal('cf-message');
      var valid   = true;

      if (!name)                        { showError('cf-name-err',  'Please enter your name.'); valid = false; }
      if (!email || !isEmail(email))    { showError('cf-email-err', 'Please enter a valid email address.'); valid = false; }
      if (!message)                     { showError('cf-msg-err',   'Please enter your message.'); valid = false; }
      if (!valid) return;

      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      window.location.href = 'mailto:hello@flashdelivery.co.za'
        + '?subject=' + encodeURIComponent(subject)
        + '&body='    + encodeURIComponent(body);

      showSuccess(contactForm, 'Your email client is opening — we\'ll be in touch soon.');
    });
  }

  /* ── Investor form ───────────────────────────────────── */
  var investorForm = document.getElementById('investor-form');
  if (investorForm) {
    investorForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(this);

      var name    = getVal('if-name');
      var email   = getVal('if-email');
      var org     = getVal('if-org') || 'Not specified';
      var message = getVal('if-message');
      var valid   = true;

      if (!name)                     { showError('if-name-err',  'Please enter your name.'); valid = false; }
      if (!email || !isEmail(email)) { showError('if-email-err', 'Please enter a valid email.'); valid = false; }
      if (!message)                  { showError('if-msg-err',   'Please enter a message.'); valid = false; }
      if (!valid) return;

      var subject = 'Investment enquiry from ' + name + ' (' + org + ')';
      var body    = 'Name: ' + name + '\nEmail: ' + email + '\nOrganisation: ' + org + '\n\n' + message;
      window.location.href = 'mailto:invest@flashdelivery.co.za'
        + '?subject=' + encodeURIComponent(subject)
        + '&body='    + encodeURIComponent(body);

      showSuccess(investorForm, 'Opening your email client…');
    });
  }

  /* ── Utilities ───────────────────────────────────────── */
  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    var inputId = id.replace('-err', '');
    var input = document.getElementById(inputId);
    if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = ''; el.style.display = 'none';
    });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function showSuccess(form, msg) {
    var banner = form.querySelector('.form-success');
    if (banner) {
      banner.textContent = msg;
      banner.style.display = 'block';
      banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (window.flashAnnounce) window.flashAnnounce(msg);
    }
  }

})();
