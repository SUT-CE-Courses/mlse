/**
 * Machine Learning Systems Engineering (MLSE 2026)
 * Accessible Navigation, Scroll-Driven Header, and Cross-Page Transitions
 * Vanilla JS - No Frameworks
 */

(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[aria-disabled="true"]');
    if (b) e.preventDefault();
  });

  var isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Course timing: "today" is the calendar date in Tehran, as YYYY-MM-DD, so
  // it compares directly with the data-date strings rendered from YAML.
  function tehranToday() {
    try {
      var value = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date());
      return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function daysBetween(from, to) {
    var a = from.split('-');
    var b = to.split('-');
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }

  var today = tehranToday();

  // Home hero: fade and lift the hero as it scrolls away, then reveal the header.
  (function () {
    var hero = document.querySelector('.page-home .home-masthead');
    if (!hero) return;
    document.documentElement.classList.add('js');
    var update = function () {
      var h = hero.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, (window.pageYOffset || 0) / (h * 1.1)));
      hero.style.setProperty('--hero-p', p.toFixed(3));
      document.body.classList.toggle('header-visible', p > 0.35);
    };
    window.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  // Course plan: mark past days and the next day, then show a window (the past
  // and anything beyond three weeks out is folded behind toggles).
  var timeline = document.querySelector('[data-plan-timeline]');
  if (timeline && today) {
    var WINDOW_DAYS = 21;
    var pastDays = [];
    var futureDays = [];
    var nextDay = null;
    Array.prototype.forEach.call(timeline.querySelectorAll('.plan-day'), function (day) {
      var start = day.getAttribute('data-date');
      var end = day.getAttribute('data-until') || start;
      if (end < today) {
        day.classList.add('is-past');
        pastDays.push(day);
      } else {
        if (!nextDay) {
          nextDay = day;
          day.classList.add('is-next');
          day.querySelector('.plan-next-flag').hidden = false;
        }
        if (daysBetween(today, start) > WINDOW_DAYS) futureDays.push(day);
      }
    });

    // Months whose days are all folded are folded too.
    var monthsFor = function (days) {
      var months = [];
      Array.prototype.forEach.call(timeline.querySelectorAll('.plan-month'), function (month) {
        var sibling = month.nextElementSibling;
        var all = true;
        while (sibling && !sibling.classList.contains('plan-month')) {
          if (days.indexOf(sibling) === -1) all = false;
          sibling = sibling.nextElementSibling;
        }
        if (all) months.push(month);
      });
      return months;
    };

    var chevron = function (up) {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6') + '"/></svg>';
    };

    var makeFold = function (days, className, labels, placeBefore) {
      if (!days.length) return null;
      var folded = days.concat(monthsFor(days));
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'plan-fold-toggle ' + className;
      button.setAttribute('aria-controls', timeline.id);
      var fold = {
        button: button,
        elements: folded,
        set: function (isFolded, instant) {
          var wasFolded = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(!isFolded));
          button.innerHTML = chevron(!isFolded) + '<span>' + (isFolded ? labels.show : labels.hide) + '</span>';
          var calm = instant || !folded[0].animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (calm || isFolded === wasFolded) {
            folded.forEach(function (el) { el.hidden = isFolded; });
            return;
          }
          folded.forEach(function (el, i) {
            var cs;
            if (!isFolded) el.hidden = false;
            cs = getComputedStyle(el);
            var full = { height: el.offsetHeight + 'px', marginBottom: cs.marginBottom, opacity: 1 };
            var none = { height: '0px', marginBottom: '0px', opacity: 0 };
            if (el.__anim) el.__anim.cancel();
            el.style.overflow = 'hidden';
            var anim = el.animate(isFolded ? [full, none] : [none, full], {
              duration: 420, delay: Math.min(i, 8) * 28, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both'
            });
            el.__anim = anim;
            anim.onfinish = function () {
              el.__anim = null; anim.cancel(); el.style.overflow = '';
              if (isFolded) el.hidden = true;
            };
          });
        }
      };
      button.addEventListener('click', function () {
        fold.set(button.getAttribute('aria-expanded') === 'true');
      });
      if (placeBefore) timeline.parentNode.insertBefore(button, timeline);
      else timeline.parentNode.insertBefore(button, timeline.nextSibling);
      fold.set(true, true);
      return fold;
    };

    var sessions = timeline.getAttribute('data-sessions');
    var pastFold = makeFold(pastDays, 'plan-earlier-toggle', {
      show: 'Show ' + pastDays.length + ' earlier ' + (pastDays.length === 1 ? 'day' : 'days'),
      hide: 'Hide earlier days'
    }, true);
    var futureFold = makeFold(futureDays, 'plan-later-toggle', {
      show: 'See full plan',
      hide: 'Collapse'
    }, false);

    // A link to a folded day (e.g. from Next up or a shared URL) unfolds first.
    var revealTarget = function () {
      var target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target && target.hidden && timeline.contains(target)) {
        [pastFold, futureFold].forEach(function (fold) {
          if (fold && fold.elements.indexOf(target) !== -1) fold.set(false);
        });
        target.scrollIntoView({ block: 'start' });
      }
    };
    window.addEventListener('hashchange', revealTarget);
    revealTarget();
  }

  /* ==========================================================================
     Sticky Header Controller
     ========================================================================== */
  var header = document.getElementById('site-header');
  var ticking = false;

  function updateScrollPhysics() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header docking state:
    // When user scrolls down (> 20px), elevate header with shadow & border
    if (header) {
      if (scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollPhysics);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollPhysics);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger on load
  updateScrollPhysics();

  /* ==========================================================================
     Cross-Page Transfer Animation Controller
     ========================================================================== */
  if (!isReducedMotion) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      // Ignore anchor jumps, protocols, and external targets
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }

      // Check if it's an internal site navigation
      var isSameOrigin = !link.origin || link.origin === window.location.origin;
      var isModifierClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (isSameOrigin && !isModifierClick && (href.startsWith('/') || href.includes('/MLSE2026'))) {
        e.preventDefault();
        document.body.classList.add('page-is-exiting');

        setTimeout(function () {
          window.location.href = href;
        }, 140);
      }
    });

    // Reset page exit state if restored from back-forward cache (bfcache)
    window.addEventListener('pageshow', function (e) {
      document.body.classList.remove('page-is-exiting');
    });
  }

  /* ==========================================================================
     Mobile Navigation Controller (ARIA-compliant)
     ========================================================================== */
  var navToggleBtn = document.getElementById('nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  if (navToggleBtn && primaryNav) {
    function closeNav() {
      navToggleBtn.setAttribute('aria-expanded', 'false');
      navToggleBtn.setAttribute('aria-label', 'Open menu');
      primaryNav.classList.remove('is-open');
    }

    function openNav() {
      navToggleBtn.setAttribute('aria-expanded', 'true');
      navToggleBtn.setAttribute('aria-label', 'Close menu');
      primaryNav.classList.add('is-open');
    }

    navToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    primaryNav.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        closeNav();
        var section = document.getElementById(anchor.hash.slice(1));
        if (section) {
          section.setAttribute('tabindex', '-1');
          section.focus({ preventScroll: true });
        }
      }
    });

    // Close on Escape key and return focus to toggle button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (navToggleBtn.getAttribute('aria-expanded') === 'true') {
          closeNav();
          navToggleBtn.focus();
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (navToggleBtn.getAttribute('aria-expanded') === 'true') {
        if (!primaryNav.contains(e.target) && !navToggleBtn.contains(e.target)) {
          closeNav();
        }
      }
    });

    // Reset when resizing to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100 && navToggleBtn.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });
  }

  // Section strip: publish the header height for sticky offsets and mark the section in view.
  (function () {
    var header = document.querySelector('.site-header');
    var setHeaderHeight = function () {
      if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    var strip = document.querySelector('.section-index');
    if (!strip || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(strip.querySelectorAll('a'));
    var visible = {};
    var mark = function () {
      var current = null;
      links.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        if (visible[id] && !current) current = link;
      });
      links.forEach(function (link) {
        if (link === current) {
          link.setAttribute('aria-current', 'true');
          if (strip.scrollWidth > strip.clientWidth) {
            strip.scrollLeft = link.offsetLeft - (strip.clientWidth - link.offsetWidth) / 2;
          }
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      mark();
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) observer.observe(target);
    });
  })();
})();

// Staff: reveal the cards in sequence once the section is near the viewport.
(function () {
  var section = document.querySelector('.section-staff');
  if (!section) return;
  section.querySelectorAll('.staff-slot').forEach(function (slot, i) { slot.style.setProperty('--i', i); });
  if (!('IntersectionObserver' in window)) { section.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { section.classList.add('is-in'); io.disconnect(); }
  }, { rootMargin: '0px 0px -15% 0px' });
  io.observe(section);
})();
