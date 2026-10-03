/* Raise Ready Kids — main.js (vanilla, no dependencies) */
(function () {
  'use strict';

  // ---- Config: fill these in before launch ----
  // Checkout link (Stripe Payment Link, Gumroad, Payhip or Shopify product). Every a.buy points here.
  var CHECKOUT_URL = '';
  // Email endpoint for the free-sample form (Formspree, Kit, Mailchimp, or /.netlify/functions/subscribe).
  var FORM_ENDPOINT = '';

  document.documentElement.classList.remove('no-js');

  // Buy buttons
  if (CHECKOUT_URL) {
    document.querySelectorAll('a.buy').forEach(function (a) {
      a.href = CHECKOUT_URL; a.target = '_blank'; a.rel = 'noopener';
    });
  }

  // Countdown to local midnight. Resets daily so the launch price always "ends tonight".
  (function () {
    var h = document.getElementById('t-h'), m = document.getElementById('t-m'), s = document.getElementById('t-s');
    if (!h) return;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
      var d = Math.max(0, end - now);
      h.textContent = pad(Math.floor(d / 3600000));
      m.textContent = pad(Math.floor(d / 60000) % 60);
      s.textContent = pad(Math.floor(d / 1000) % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  // Dismissible top bar
  var bar = document.getElementById('urgentBar');
  var barX = bar && bar.querySelector('.x');
  if (barX) barX.addEventListener('click', function () { bar.classList.add('is-hidden'); });

  // Header shadow + mobile nav
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '☰'; });
    });
  }

  // Sticky mobile buy bar: show once the hero has scrolled away, hide at the offer box
  var sticky = document.querySelector('.sticky');
  var hero = document.querySelector('.hero');
  var offer = document.getElementById('get');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroGone = false, offerVisible = false;
    function updateSticky() { sticky.classList.toggle('show', heroGone && !offerVisible); }
    new IntersectionObserver(function (es) { heroGone = !es[0].isIntersecting; updateSticky(); }, { threshold: 0.1 }).observe(hero);
    if (offer) new IntersectionObserver(function (es) { offerVisible = es[0].isIntersecting; updateSticky(); }, { threshold: 0.2 }).observe(offer);
  }

  // Scroll reveal
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  // Count-up stats: <div class="v" data-count="150" data-suffix="+">0</div>
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var start = null, dur = 1200;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { co.observe(c); });
    } else counters.forEach(runCount);
  }

  // Pinned 3-step plan: active step drives the visible frame
  var steps = document.querySelectorAll('.step[data-step]');
  var frames = document.querySelectorAll('.frame[data-frame]');
  function setStep(i) {
    steps.forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-step') === String(i)); });
    frames.forEach(function (f) { f.classList.toggle('active', f.getAttribute('data-frame') === String(i)); });
  }
  if (steps.length && 'IntersectionObserver' in window) {
    setStep(0);
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setStep(e.target.getAttribute('data-step')); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { so.observe(s); });
  } else setStep(0);

  // Free-sample opt-in. Never block the user if the request fails.
  var form = document.querySelector('form[data-optin]');
  if (form) {
    var ok = document.getElementById('success'), err = document.getElementById('form-error'), btn = form.querySelector('button[type=submit]');
    var label = btn ? btn.innerHTML : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (err) err.hidden = true;
      var email = (form.email.value || '').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { if (err) { err.textContent = 'Enter a real email so we know where to send it.'; err.hidden = false; } return; }
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      function done() { form.hidden = true; if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
      function fail() { if (btn) { btn.disabled = false; btn.innerHTML = label; } if (err) { err.textContent = 'That didn’t go through. Try again in a moment.'; err.hidden = false; } }
      if (!FORM_ENDPOINT) { setTimeout(done, 500); return; }
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, tags: form.getAttribute('data-tags') || '', source: 'rrk-landing' }) })
        .then(function (r) { r.ok ? done() : fail(); }).catch(fail);
    });
  }


  // Story video: CHANGE STORY_VIDEO_URL if you replace the clip. Captions cycle on their own.
  var STORY_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FaAuoqKZWFjGoO7chkwjulgahN/hf_20261003_103013_e8788564-5ba0-40cf-a86a-a6abddf781a2.mp4';
  (function () {
    var fig = document.getElementById('story'); if (!fig) return;
    var vid = document.getElementById('storyVid'), btn = fig.querySelector('.story-play');
    var lines = fig.querySelectorAll('.cap-line'), i = 0, timer = null;
    if (STORY_VIDEO_URL && vid) { var src = vid.querySelector('source'); src.src = STORY_VIDEO_URL; vid.load(); }
    function show(n) { lines.forEach(function (l, k) { l.classList.toggle('active', k === n); }); }
    function startCaps() { if (timer) return; timer = setInterval(function () { i = (i + 1) % lines.length; show(i); }, 3200); }
    function stopCaps() { clearInterval(timer); timer = null; }
    function play() { fig.classList.add('playing'); if (vid && STORY_VIDEO_URL) { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); } startCaps(); }
    if (btn) btn.addEventListener('click', play);
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) play();
          else { if (vid) vid.pause(); stopCaps(); fig.classList.remove('playing'); }
        });
      }, { threshold: 0.5 }).observe(fig);
    }
  })();

  // Week timeline: fill the line when the week scrolls in
  (function () {
    var wk = document.querySelector('.week'); if (!wk) return;
    if (reduce || !('IntersectionObserver' in window)) { wk.classList.add('in'); return; }
    var wo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { wk.classList.add('in'); wo.disconnect(); } }, { threshold: 0.3 });
    wo.observe(wk);
  })();


  // Copy email button (contact page)
  var ce = document.getElementById('copyEmail');
  if (ce) ce.addEventListener('click', function () {
    var em = ce.getAttribute('data-email');
    function ok() { ce.textContent = 'Copied ✓'; setTimeout(function () { ce.textContent = 'Copy email address'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(em).then(ok, function () { window.prompt('Copy this email:', em); });
    else window.prompt('Copy this email:', em);
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
