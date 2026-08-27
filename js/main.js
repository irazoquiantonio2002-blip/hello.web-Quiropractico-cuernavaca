/* ═══════════════════════════════════════════════════════════════
   QUIROPRÁCTICO CUERNAVACA — Interacciones
   Loader · Navbar · Menú móvil · Partículas hero · Marquee ·
   Reveal on scroll · Contadores · Formulario a WhatsApp
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* TODO: reemplazar por el número real de WhatsApp (formato internacional, sin signos) */
  var WA_NUMBER = '52XXXXXXXXXX';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ───────────────────────── LOADER ───────────────────────── */
  (function loader() {
    var el   = $('#loader');
    var fill = $('.loader-bar-fill');
    if (!el) { revealHero(); return; }

    var pct = 0;
    var tick = setInterval(function () {
      pct = Math.min(100, pct + Math.random() * 22);
      if (fill) fill.style.width = pct + '%';
      if (pct >= 100) clearInterval(tick);
    }, 130);

    function close() {
      if (fill) fill.style.width = '100%';
      el.classList.add('done');
      revealHero();
      setTimeout(function () { el.remove(); }, 700);
    }
    window.addEventListener('load', function () { setTimeout(close, 550); });
    /* Salvaguarda: nunca dejar el loader bloqueando */
    setTimeout(close, 4000);
  })();

  function revealHero() {
    var hero = $('#hero');
    if (hero) hero.classList.add('hero-ready');
  }

  /* ───────────────────────── NAVBAR ───────────────────────── */
  (function navbar() {
    var nav = $('#navbar');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ─────────────────────── MENÚ MÓVIL ─────────────────────── */
  (function mobileMenu() {
    var btn  = $('#hamburger');
    var menu = $('#mob-menu');
    if (!btn || !menu) return;

    var toggle = function (force) {
      var open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      btn.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', function () { toggle(); });
    $$('#mob-menu a').forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
  })();

  /* ─────────────── PARTÍCULAS DEL HERO (canvas) ─────────────── */
  (function heroParticles() {
    var canvas = $('#hero-canvas');
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext('2d');
    var w, h, dots = [];

    function resize() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      var count = Math.round((w * h) / 26000);
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.4 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.5 + 0.1
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(159,227,214,' + d.a + ')';
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
  })();

  /* ───────────────────────── MARQUEE ───────────────────────── */
  (function marquee() {
    var track = $('#marquee');
    if (!track) return;
    var items = [
      'Dolor de espalda', 'Cervicales', 'Ciática', 'Hernia de disco',
      'Migrañas y cefaleas', 'Mala postura', 'Contracturas', 'Lesiones deportivas',
      'Estrés y tensión', 'Escoliosis', 'Dolor lumbar', 'Movilidad articular'
    ];
    var unit = items.map(function (t) {
      return '<span class="marquee-item"><i class="fa-solid fa-circle"></i>' + t + '</span>';
    }).join('');
    /* Se duplica el contenido para un bucle continuo */
    track.innerHTML = unit + unit;
  })();

  /* ─────────────────── REVEAL ON SCROLL ─────────────────── */
  (function reveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || prefersReduced) {
      els.forEach(function (el) { el.classList.add('in'); });
      startCounters(document);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        startCounters(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });

    /* Salvaguarda: revela cualquier bloque que ya esté en pantalla
       aunque el observer no haya disparado (navegación con #hash, etc.) */
    function sweep() {
      $$('.reveal:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 20) {
          el.classList.add('in');
          startCounters(el);
          io.unobserve(el);
        }
      });
    }
    window.addEventListener('load', function () { setTimeout(sweep, 400); });
    window.addEventListener('scroll', sweep, { passive: true, once: true });
  })();

  /* ─────────────────── CONTADORES (stats) ─────────────────── */
  function startCounters(scope) {
    $$('.stat-num', scope).forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.dataset.count || '0');
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var dur = 1500, start = null;

      if (prefersReduced || !target) {
        el.textContent = prefix + target + suffix;
        return;
      }
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('es-MX') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ───────────── FORMULARIO → WHATSAPP ───────────── */
  (function waForm() {
    var form = $('#wa-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#f-name');
      var interest = $('#f-interest');
      var msg = $('#f-msg');
      var ok = true;

      [name, msg].forEach(function (field) {
        var empty = !field.value.trim();
        field.classList.toggle('invalid', empty);
        if (empty) ok = false;
      });
      if (!ok) { name.value.trim() || name.focus(); return; }

      var text =
        'Hola, quiero agendar una sesión de quiropráctica.\n\n' +
        'Nombre: ' + name.value.trim() + '\n' +
        'Motivo: ' + (interest ? interest.value : '') + '\n' +
        'Detalle: ' + msg.value.trim();

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });

    /* Quita el estado de error al escribir */
    $$('#wa-form .form-control').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('invalid'); });
    });
  })();

  /* ───────────────────────── VARIOS ───────────────────────── */
  (function misc() {
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    /* Aplica el número de WhatsApp a todos los enlaces con marcador */
    if (WA_NUMBER && WA_NUMBER.indexOf('X') === -1) {
      $$('a[href*="wa.me/52XXXXXXXXXX"]').forEach(function (a) {
        a.href = a.href.replace('52XXXXXXXXXX', WA_NUMBER);
      });
    }
  })();

})();
