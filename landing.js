// Bibloom landing — small progressive enhancements (the page works without JS).
(function () {
  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menuBtn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  }

  // Features: one open at a time; on desktop the phone shows the open one.
  var features = Array.prototype.slice.call(document.querySelectorAll('.feature'));
  var shot = document.getElementById('feature-shot');
  var phone = document.querySelector('.feature-phone');
  features.forEach(function (f) {
    f.addEventListener('toggle', function () {
      if (!f.open) return;
      features.forEach(function (o) { if (o !== f) o.open = false; });
      var src = f.getAttribute('data-shot');
      if (shot && phone && src && shot.getAttribute('src') !== src) {
        phone.classList.add('is-swapping');
        setTimeout(function () {
          shot.setAttribute('src', src);
          phone.classList.remove('is-swapping');
        }, 200);
      }
    });
  });

  // Steps: click (or auto-advance) moves the bubble and its tail.
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var bubble = document.querySelector('.bubble');
  var copies = bubble ? Array.prototype.slice.call(bubble.querySelectorAll('[data-copy]')) : [];
  var current = 0;
  var timer = null;
  function showStep(i) {
    current = i;
    steps.forEach(function (s, j) {
      s.classList.toggle('is-active', j === i);
      s.setAttribute('aria-selected', String(j === i));
    });
    copies.forEach(function (c, j) { c.hidden = j !== i; });
    placeTail();
  }
  // Point the bubble's tail at the centre of the active step (any width).
  function placeTail() {
    if (!bubble || !steps[current]) return;
    var r = steps[current].getBoundingClientRect();
    var b = bubble.getBoundingClientRect();
    var x = Math.min(Math.max(r.left + r.width / 2 - b.left, 32), b.width - 32);
    bubble.style.setProperty('--tail', x + 'px');
  }
  window.addEventListener('resize', placeTail);
  function startAuto() {
    stopAuto();
    timer = setInterval(function () { showStep((current + 1) % steps.length); }, 4500);
  }
  function stopAuto() { if (timer) clearInterval(timer); timer = null; }
  steps.forEach(function (s, i) {
    s.addEventListener('click', function () { showStep(i); startAuto(); });
  });
  if (steps.length) { showStep(0); startAuto(); }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
