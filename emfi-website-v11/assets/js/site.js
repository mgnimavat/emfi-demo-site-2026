/* EMFI v4 behaviour. Vanilla JS, no dependencies. */
(function (root) {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SNAP = Date.UTC(2026, 10, 15);

  /* ---------- Say Less quiz (qualitative diagnostic only) ---------- */
  var QUESTIONS = [
    { g: 'cost', q: 'How clear are the fees you pay today for settlement and custody?', o: [['Fully itemised and understood', 0], ['Mostly clear, a few unexplained lines', 1], ['Hard to reconcile to what we were told', 2], ['Other / not sure', 1]] },
    { g: 'cost', q: 'How are your current custody and minimum charges structured?', o: [['Transparent, volume-based tiers', 0], ['Flat or bundled charges', 1], ['Multiple layers of pass-through charges', 2], ['Other / not sure', 1]] },
    { g: 'complexity', q: 'How many parties handle a typical trade between execution and custody?', o: [['One or two', 0], ['Three', 1], ['Four or more', 2], ['Other / not sure', 1]] },
    { g: 'complexity', q: 'When a request does not fit the standard process, what happens?', o: [['A named person resolves it', 0], ['It is escalated, with delays', 1], ['Tickets and queues, slow answers', 2], ['Other / not sure', 1]] },
    { g: 'exposure', q: 'How are your securities held with your current provider?', o: [['In accounts identified to us', 0], ['In a shared omnibus account', 2], ['Mixed, depending on market', 1], ['Other / not sure', 1]] },
    { g: 'exposure', q: 'When a sell fails, what happens to the linked buy?', o: [['It is held back until the sell is ready', 0], ['It settles, and we finance the gap', 2], ['It depends on the case', 1], ['Other / not sure', 1]] }
  ];
  var GROUPS = { cost: 'Cost', complexity: 'Complexity', exposure: 'Exposure' };
  var COPY = {
    cost: ['Fee clarity may be worth examining', 'Ask your provider for one schedule showing charging basis, minimums, currency and pass-through items.'],
    complexity: ['Hand-offs may be worth examining', 'Map who touches a trade between execution and custody, and who is accountable for exceptions.'],
    exposure: ['Account structure may be worth examining', 'Check whether your securities are identified to you, and how linked buy and sell instructions are handled.']
  };
  function score(answers) {
    var t = { cost: 0, complexity: 0, exposure: 0 }, m = { cost: 0, complexity: 0, exposure: 0 };
    QUESTIONS.forEach(function (q, i) { var a = answers[i]; if (a == null) return; t[q.g] += q.o[a][1]; m[q.g] += 2; });
    return { totals: t, max: m };
  }
  function level(v, max) { var r = max ? v / max : 0; return r >= 0.6 ? 'high' : r >= 0.3 ? 'medium' : 'low'; }
  function initQuiz(el) {
    var i = 0, ans = [], q = function (s) { return $(s, el); };
    var grp = q('[data-g]'), cnt = q('[data-c]'), bar = q('.qprog span'), qEl = q('[data-q]'), opts = q('[data-o]'),
      back = q('[data-back]'), next = q('[data-next]'), body = q('[data-body]'), res = q('[data-res]');
    function sync() { $$('label', opts).forEach(function (l) { l.classList.toggle('sel', l.firstChild.checked); }); }
    function render() {
      var Q = QUESTIONS[i]; grp.textContent = GROUPS[Q.g].toUpperCase(); cnt.textContent = (i + 1) + ' / ' + QUESTIONS.length;
      bar.style.width = ((i + 1) / QUESTIONS.length * 100) + '%'; qEl.textContent = Q.q; opts.innerHTML = '';
      Q.o.forEach(function (o, k) {
        var l = document.createElement('label'), r = document.createElement('input'); r.type = 'radio'; r.name = 'q' + i; r.value = k; r.checked = ans[i] === k;
        r.addEventListener('change', function () { ans[i] = k; next.disabled = false; sync(); });
        l.appendChild(r); l.appendChild(document.createTextNode(o[0])); opts.appendChild(l);
      });
      sync(); back.disabled = i === 0; next.disabled = ans[i] == null; next.textContent = i === QUESTIONS.length - 1 ? 'See result' : 'Next';
    }
    function finish() {
      body.hidden = true; res.hidden = false; var s = score(ans), box = q('[data-scores]'), top = null; box.innerHTML = '';
      Object.keys(s.totals).forEach(function (k) {
        if (!top || s.totals[k] > s.totals[top]) top = k;
        var d = document.createElement('div'); d.className = 'sr';
        d.innerHTML = '<b>' + GROUPS[k] + '</b><div class="bar"><i style="width:' + (s.max[k] ? s.totals[k] / s.max[k] * 100 : 0) + '%"></i></div><small>' + COPY[k][0] + ' (' + level(s.totals[k], s.max[k]) + ' indication). ' + COPY[k][1] + '</small>';
        box.appendChild(d);
      });
      q('[data-rt]').textContent = 'Where to look first: ' + GROUPS[top];
    }
    next.addEventListener('click', function () { if (i < QUESTIONS.length - 1) { i++; render(); } else finish(); });
    back.addEventListener('click', function () { if (i > 0) { i--; render(); } });
    q('[data-restart]').addEventListener('click', function () { i = 0; ans = []; res.hidden = true; body.hidden = false; render(); });
    render();
  }

  /* ---------- Archive ---------- */
  function filterPubs(list, term, days, country) {
    term = (term || '').trim().toLowerCase();
    return list.filter(function (p) {
      if (country && country !== 'all' && p.country !== country) return false;
      if (days && (SNAP - Date.parse(p.date + 'T00:00:00Z')) / 864e5 > days) return false;
      return !term || (p.title + ' ' + p.country + ' ' + p.type + ' ' + p.extract).toLowerCase().indexOf(term) > -1;
    });
  }
  function initArchive(el) {
    var data = JSON.parse(el.getAttribute('data-pubs') || '[]'), qs = $('[data-qs]', el), pe = $('[data-pe]', el), co = $('[data-co]', el), list = $('[data-list]', el), n = $('[data-n]', el);
    data.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    var cs = {}; data.forEach(function (p) { cs[p.country] = 1; });
    Object.keys(cs).sort().forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = c; co.appendChild(o); });
    var esc = function (s) { var e = document.createElement('div'); e.textContent = s; return e.innerHTML; };
    function draw() {
      var r = filterPubs(data, qs.value, +pe.value || 0, co.value); list.innerHTML = '';
      r.forEach(function (p) {
        var d = document.createElement('article'); d.className = 'pub';
        var dt = new Date(p.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
        d.innerHTML = '<time datetime="' + p.date + '">' + dt + '</time><div><div class="meta">' + esc(p.country) + ' · ' + esc(p.type) + '</div><h3>' + esc(p.title) + '</h3>' + (p.extract ? '<p>' + esc(p.extract) + '</p>' : '') + '<p class="cls">EMFI Securities Limited &middot; Not independent investment research &middot; <a href="legal.html#publication">Disclosures</a></p></div><div class="acc">Subscriber access</div>';
        list.appendChild(d);
      });
      n.textContent = r.length ? '' : 'No publications match your search.';
    }
    [qs, pe, co].forEach(function (x) { x.addEventListener('input', draw); });
    $('[data-reset]', el).addEventListener('click', function () { qs.value = ''; pe.value = ''; co.value = 'all'; draw(); });
    draw();
  }

  /* ---------- scaled UI mock-ups ---------- */
  function initScale(box) {
    var s = $('.scaler', box), w = 1240;
    function fit() { var k = Math.max(box.clientWidth / w, .5); s.style.transform = 'scale(' + k + ')'; box.style.height = (s.offsetHeight * k) + 'px'; box.style.overflowX = box.clientWidth / w < .5 ? 'auto' : 'hidden'; }
    fit(); addEventListener('resize', fit); addEventListener('load', fit);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fit).observe(box);
    box._fit = fit;
  }

  /* ---------- treemap (synthetic) ---------- */
  function squarify(items, rect) {
    var out = [], row = [], r = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
    function worst(rw, side) { var s = 0, mx = 0, mn = 1e18; rw.forEach(function (i) { s += i.a; mx = Math.max(mx, i.a); mn = Math.min(mn, i.a); }); return Math.max(side * side * mx / (s * s), s * s / (side * side * mn)); }
    function lay(rw) {
      var s = rw.reduce(function (a, i) { return a + i.a; }, 0);
      if (r.w >= r.h) { var cw = s / r.h, yy = r.y; rw.forEach(function (i) { var hh = i.a / cw; out.push({ d: i.d, x: r.x, y: yy, w: cw, h: hh }); yy += hh; }); r = { x: r.x + cw, y: r.y, w: r.w - cw, h: r.h }; }
      else { var rh = s / r.w, xx = r.x; rw.forEach(function (i) { var ww = i.a / rh; out.push({ d: i.d, x: xx, y: r.y, w: ww, h: rh }); xx += ww; }); r = { x: r.x, y: r.y + rh, w: r.w, h: r.h - rh }; }
    }
    var rest = items.slice();
    while (rest.length) {
      var side = Math.min(r.w, r.h), nr = row.concat([rest[0]]);
      if (!row.length || worst(nr, side) <= worst(row, side)) { row = nr; rest.shift(); } else { lay(row); row = []; }
    }
    if (row.length) lay(row); return out;
  }
  var NAMES = ['SOV A 6.3 2031', 'FUT EUR', 'CORP B 5.0 2029', 'SOV C 6.0 2026', 'CORP D 6.0 2024', 'FX JPY', 'CORP E 8.3', 'SOV F 7.5', 'GOLD', 'CORP G 3.9', 'SOV H 10', 'CORP I 5.5'];
  var COL = ['#8a93a5', '#b0bfe0', '#3f4249', '#8d9199', '#001a34', '#9ab8d6'];
  function drawTree() {
    $$('[data-tree]').forEach(function (t) {
      if (!t.offsetWidth) return; t.innerHTML = '';
      var N = 80, items = [], tot = 0, seed = 7;
      for (var i = 0; i < N; i++) { seed = (seed * 9301 + 49297) % 233280; var v = 1 / Math.pow(i + 1.4, 1.15) * (0.75 + seed / 233280 * .5); items.push({ v: v, i: i }); tot += v; }
      var W = t.clientWidth, H = t.clientHeight, area = W * H;
      var lay = squarify(items.map(function (o) { return { a: o.v / tot * area, d: o.i }; }), { x: 0, y: 0, w: W, h: H });
      lay.forEach(function (c) {
        var d = document.createElement('div'); d.style.cssText = 'left:' + c.x + 'px;top:' + c.y + 'px;width:' + c.w + 'px;height:' + c.h + 'px;background:' + (c.d === 3 ? '#ee2b2b' : COL[(c.d * 7 + (c.d > 3 ? 2 : 0)) % COL.length]);
        if (c.w > 34 && c.h > 22) d.textContent = c.d < NAMES.length ? NAMES[c.d] : ''; t.appendChild(d);
      });
    });
  }

  /* ---------- fund performance (illustrative placeholder) ---------- */
  function initFund(el) {
    var pts = JSON.parse(el.getAttribute('data-pts')), svg = $('svg', el), line = $('.ln', el), area = $('.ar', el), ax = $('.axl', el), T0 = 2022.15, T1 = 2026.87;
    var W = 1000, H = 360, padB = 34;
    function draw(rng) {
      var a = pts.length, from = rng === '1y' ? Math.floor(a * .8) : rng === '3y' ? Math.floor(a * .38) : 0;
      var seg = pts.slice(from), mn = Math.min.apply(null, seg), mx = Math.max.apply(null, seg), d = '';
      seg.forEach(function (v, k) { var x = k / (seg.length - 1) * W, y = 14 + (1 - (v - mn) / (mx - mn || 1)) * (H - padB - 28); d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); });
      line.setAttribute('d', d); area.setAttribute('d', d + 'L' + W + ' ' + (H - padB) + 'L0 ' + (H - padB) + 'Z');
      var ts = T0 + from / (a - 1) * (T1 - T0), span = T1 - ts, h = '';
      for (var y = Math.ceil(ts); y <= Math.floor(T1); y++) { var x = (y - ts) / span * W; if (x > 30 && x < W - 30) h += '<text x="' + x + '" y="' + (H - 8) + '" text-anchor="middle">' + y + '</text><path d="M' + x + ' 0V' + (H - padB) + '" stroke="#e3eaf4" stroke-dasharray="3 5"/>'; }
      ax.innerHTML = h; var len = line.getTotalLength ? line.getTotalLength() : 3000;
      if (!reduce) { line.style.transition = 'none'; line.style.strokeDasharray = len; line.style.strokeDashoffset = len; line.getBoundingClientRect(); line.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)'; line.style.strokeDashoffset = 0; }
    }
    var btns = $$('.rng button', el);
    btns.forEach(function (b) { b.addEventListener('click', function () { btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); draw(b.getAttribute('data-r')); }); });
    var open = false; try { open = sessionStorage.getItem('emfi_pi') === '1'; } catch (e) {}
    function show() { el.classList.add('open'); draw('all'); }
    var gf = $('[data-gateform]', el);
    if (open || !gf) show(); else {
      draw('all');
      var gm = $('[data-gm]', el), say = function (t) { gm.textContent = t; gm.hidden = false; };
      gf.addEventListener('submit', function (e) {
        e.preventDefault();
        var who = $('[data-gs]', el).value, where = $('[data-gc]', el).value, ack = $('[data-gr]', el).checked;
        if (!who || !where) return say('Please choose who you are and where you are located.');
        if (where === 'us') return say('This information is not available to US persons.');
        if (!ack) return say('Please confirm the risk statement to continue.');
        try { sessionStorage.setItem('emfi_pi', '1'); } catch (x) {} show();
      });
      $('[data-gno]', el).addEventListener('click', function () { say('This information is for professional clients and eligible counterparties only, so it is not available to you.'); });
    }
  }

  /* ---------- pinned route collapse ---------- */
  function initPin(pin) {
    var st = $('.stick', pin), hop = $('[data-hops]', pin), firm = $('[data-firms]', pin), cap = $('[data-cap]', pin);
    if (reduce) { pin.classList.add('static'); st.style.setProperty('--p', 1); hop.textContent = 2; firm.textContent = 1; cap.textContent = 'EMFI route'; return; }
    function upd() {
      var r = pin.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight), 0, 1), q = clamp((p - .18) / .62, 0, 1);
      st.style.setProperty('--p', q.toFixed(3)); hop.textContent = Math.round(4 - 2 * q); firm.textContent = Math.round(3 - 2 * q);
      cap.textContent = q < .08 ? 'Conventional route' : q > .92 ? 'EMFI route' : 'Removing hand-offs…';
    }
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* ---------- story year ---------- */
  function initStory(el) {
    var yr = $('[data-yr]', el), sub = $('[data-ys]', el), ch = $$('.chap', el);
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var y = e.target.getAttribute('data-y'), z = e.target.getAttribute('data-s'); if (yr.textContent === y) return; var box = yr.parentNode; box.classList.add('swap'); setTimeout(function () { yr.textContent = y; sub.textContent = z; box.classList.remove('swap'); }, reduce ? 0 : 160); } }); }, { rootMargin: '-45% 0px -45% 0px' });
    ch.forEach(function (c) { io.observe(c); });
  }

  function initMap(el) {
    $('button', el).addEventListener('click', function () {
      var f = document.createElement('iframe'); f.loading = 'lazy'; f.title = el.getAttribute('data-title') || 'Map'; f.referrerPolicy = 'no-referrer-when-downgrade';
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(el.getAttribute('data-q')) + '&output=embed'; el.innerHTML = ''; el.appendChild(f);
    });
  }

  function init() {
    var h = $('.hdr'), t = $('.burger');
    if (t) t.addEventListener('click', function () { var o = h.classList.toggle('open'); t.setAttribute('aria-expanded', o); });
    if (reduce) document.documentElement.classList.add('noanim'), document.body.classList.add('noanim');
    $$('[data-quiz]').forEach(initQuiz); $$('[data-archive]').forEach(initArchive); $$('.scalebox').forEach(initScale);
    $$('[data-fund]').forEach(initFund); $$('[data-pin]').forEach(initPin); $$('[data-story]').forEach(initStory); $$('[data-map]').forEach(initMap);
    drawTree(); addEventListener('resize', drawTree);
    var rv = $$('.rv');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
      rv.forEach(function (n, i) { n.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(n); });
    } else rv.forEach(function (n) { n.classList.add('in'); });
    var em = $('.emark g.par');
    if (em && !reduce) addEventListener('mousemove', function (e) { var x = (e.clientX / innerWidth - .5) * 22, y = (e.clientY / innerHeight - .5) * 16; em.style.transform = 'translate(' + x + 'px,' + y + 'px)'; });
    $$('form[data-demo]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault(); var em2 = $('[type=email]', f), c = $('[data-req]', f), msg = $('.ok', f);
        if (em2 && !em2.value) { em2.focus(); return; } if (c && !c.checked) { c.focus(); return; } msg.hidden = false;
      });
    });
    var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
    var fb = $('.flagbtn'); if (fb) fb.addEventListener('click', function () { document.body.classList.add('clean'); });
    if (/[?&]clean/.test(location.search)) document.body.classList.add('clean');
  }
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init(); }
  root.EMFI = { QUESTIONS: QUESTIONS, score: score, level: level, filterPubs: filterPubs, squarify: squarify };
  if (typeof module !== 'undefined') module.exports = root.EMFI;
})(typeof window !== 'undefined' ? window : globalThis);
