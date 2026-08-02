/* Cosmic Pets, site behaviour. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── mobile nav ──────────────────────────────────────────────────────── */

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ── sticky nav shadow ───────────────────────────────────────────────── */

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── scroll reveal ───────────────────────────────────────────────────── */

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ── portrait lightbox ───────────────────────────────────────────────── */

  var portraits = Array.prototype.slice.call(document.querySelectorAll('[data-portrait]'));

  if (portraits.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Portrait viewer');
    box.hidden = false;
    box.innerHTML =
      '<div class="lightbox-bar">' +
        '<div><span class="lightbox-title"></span> <span class="lightbox-count"></span></div>' +
        '<button class="lb-btn lb-close" type="button" aria-label="Close viewer">✕</button>' +
      '</div>' +
      '<div class="lightbox-stage">' +
        '<button class="lb-btn lb-nav lb-prev" type="button" aria-label="Previous portrait">‹</button>' +
        '<img alt="">' +
        '<button class="lb-btn lb-nav lb-next" type="button" aria-label="Next portrait">›</button>' +
      '</div>' +
      '<p class="lightbox-foot"></p>';
    document.body.appendChild(box);

    var lbImg = box.querySelector('img');
    var lbTitle = box.querySelector('.lightbox-title');
    var lbCount = box.querySelector('.lightbox-count');
    var lbFoot = box.querySelector('.lightbox-foot');
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + portraits.length) % portraits.length;
      var el = portraits[index];
      lbImg.classList.remove('is-ready');
      var full = el.getAttribute('data-full');
      var name = el.getAttribute('data-name') || '';
      var story = el.getAttribute('data-story') || '';

      var loader = new Image();
      loader.onload = function () {
        lbImg.src = full;
        lbImg.alt = name + ', a Cosmic Pet portrait';
        lbImg.classList.add('is-ready');
      };
      loader.src = full;

      lbTitle.textContent = name;
      lbCount.textContent = (index + 1) + ' / ' + portraits.length;
      lbFoot.textContent = story;
      lbFoot.style.display = story ? '' : 'none';

      // warm the neighbours
      [portraits[(index + 1) % portraits.length],
       portraits[(index - 1 + portraits.length) % portraits.length]]
        .forEach(function (n) { if (n) { new Image().src = n.getAttribute('data-full'); } });
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
      box.querySelector('.lb-close').focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      if (lastFocus) { lastFocus.focus(); }
    }

    portraits.forEach(function (el, i) {
      el.addEventListener('click', function () { open(i); });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox-stage')) { close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { close(); }
      if (e.key === 'ArrowRight') { show(index + 1); }
      if (e.key === 'ArrowLeft') { show(index - 1); }
      if (e.key === 'Tab') {
        var focusables = box.querySelectorAll('button');
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // swipe
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) { return; }
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { show(index + (dx < 0 ? 1 : -1)); }
      startX = null;
    }, { passive: true });
  }

  /* ── preselect a package from ?package=… ─────────────────────────────── */

  var pkg = document.querySelector('[data-package-select]');
  if (pkg) {
    var wanted = new URLSearchParams(window.location.search).get('package');
    if (wanted) {
      Array.prototype.forEach.call(pkg.options, function (opt) {
        if (opt.value.toLowerCase() === wanted.toLowerCase()) { pkg.value = opt.value; }
      });
    }
  }

  /* ── contact form (Formspree, submitted over fetch) ──────────────────── */

  var form = document.querySelector('[data-ajax-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var submitLabel = submit ? submit.textContent : '';

    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';

      // Not wired up to an endpoint yet: let the browser handle it normally so
      // nothing silently swallows the message.
      if (action.indexOf('YOUR_FORM_ID') !== -1) { return; }

      e.preventDefault();
      status.className = 'form-status';
      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.className = 'form-status is-visible is-ok';
          status.textContent = 'Thank you! Your message is on its way. I will get back to you as soon as I can.';
        } else {
          throw new Error('bad response');
        }
      }).catch(function () {
        status.className = 'form-status is-visible is-err';
        status.innerHTML = 'Something went wrong sending that. Please email me directly at ' +
          '<a class="text-link" href="mailto:hello@cosmicpets.co.uk">hello@cosmicpets.co.uk</a>.';
      }).then(function () {
        if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
      });
    });
  }

  /* ── current year ────────────────────────────────────────────────────── */

  var year = document.querySelector('[data-year]');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
