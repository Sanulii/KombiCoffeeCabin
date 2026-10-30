/* ══════════════════════════════════════════════════════════════
   KOMBI COFFEE CABIN — Gallery page behaviour
   Filters, scroll reveal, and the click-to-enlarge photo viewer.
   Plain JavaScript, no libraries. Only runs on the gallery page.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var grid = document.getElementById('kg-grid');
  if (!grid) return;

  var tiles = Array.prototype.slice.call(grid.querySelectorAll('.kg-tile'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.kg-chip'));
  var countEl = document.getElementById('kg-count');
  var lb = document.getElementById('kg-lb');
  var stage = document.getElementById('kg-lb-stage');
  var idxEl = document.getElementById('kg-lb-idx');
  var capEl = document.getElementById('kg-lb-cap');
  var tagEl = document.getElementById('kg-lb-tag');
  var closeBtn = document.getElementById('kg-lb-x');
  var prevBtn = document.getElementById('kg-lb-prev');
  var nextBtn = document.getElementById('kg-lb-next');

  var current = -1;
  var lastFocused = null;

  /* ── 1. Filter chips ─────────────────────────────────────── */
  function applyFilter(value) {
    var shown = 0;

    grid.classList.toggle('is-flat', value !== 'all');

    tiles.forEach(function (tile) {
      var match = value === 'all' || tile.getAttribute('data-cat') === value;
      tile.classList.toggle('is-hidden', !match);
      if (match) {
        shown++;
        tile.classList.add('is-in');
      }
    });

    if (countEl) {
      countEl.textContent = 'Showing ' + shown + (shown === 1 ? ' frame' : ' frames');
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-on'); });
      chip.classList.add('is-on');
      applyFilter(chip.getAttribute('data-filter'));
    });
  });

  /* ── 2. Reveal tiles as you scroll ───────────────────────── */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && 'IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          seen.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    tiles.forEach(function (tile) { seen.observe(tile); });
  } else {
    tiles.forEach(function (tile) { tile.classList.add('is-in'); });
  }

  /* ── 3. Photo viewer ─────────────────────────────────────── */
  function visibleTiles() {
    return tiles.filter(function (t) { return !t.classList.contains('is-hidden'); });
  }

  function paint(tile) {
    var shot = tile.querySelector('.kg-shot');
    var name = tile.querySelector('.kg-name');
    var tag = tile.querySelector('.kg-tag');
    var num = tile.querySelector('.kg-num');

    stage.innerHTML = '';
    var clone = shot.cloneNode(true);
    var lens = clone.querySelector('.kg-lens');
    if (lens) lens.remove();
    clone.removeAttribute('class');
    clone.removeAttribute('type');
    clone.removeAttribute('aria-label');
    clone.className = 'kg-shot';
    stage.appendChild(clone);

    idxEl.textContent = num ? num.textContent : '';
    capEl.textContent = name ? name.textContent : '';
    tagEl.textContent = tag ? tag.textContent : '';
  }

  function open(tile) {
    var list = visibleTiles();
    current = list.indexOf(tile);
    if (current < 0) return;

    lastFocused = document.activeElement;
    paint(list[current]);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lb.hidden = true;
    stage.innerHTML = '';
    document.body.style.overflow = '';
    current = -1;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function step(direction) {
    var list = visibleTiles();
    if (!list.length) return;
    current = (current + direction + list.length) % list.length;
    paint(list[current]);
  }

  tiles.forEach(function (tile) {
    var shot = tile.querySelector('.kg-shot');
    if (shot) shot.addEventListener('click', function () { open(tile); });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

  lb.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  /* ── 4. Touch swipe between photos ───────────────────────── */
  var touchX = null;

  lb.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
})();
