// Avratanu Roy academic homepage scripts
(function () {
  // Highlight the current page in the menu
  var here = document.body.dataset.page;
  document.querySelectorAll('.menu a').forEach(function (a) {
    if (a.dataset.page === here) a.setAttribute('aria-current', 'page');
  });

  // Copy buttons with a selection fallback
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.dataset.target);
      var reset = function () { setTimeout(function () { btn.textContent = 'Copy'; }, 1600); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'Selected'; reset();
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(el.textContent).then(function () { btn.textContent = 'Copied'; reset(); }, fallback);
        } else { fallback(); }
      } catch (e) { fallback(); }
    });
  });

  // Illustrative density-adaptive Voronoi field over an unsignalised T-intersection
  var canvas = document.getElementById('field');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var road = { y0: H * 0.50, y1: H * 0.82, x0: W * 0.44, x1: W * 0.60, top: H * 0.04 };
  function onRoad(x, y) {
    return (y > road.y0 && y < road.y1) || (x > road.x0 && x < road.x1 && y <= road.y0 && y > road.top);
  }
  var seeds = [], cx = (road.x0 + road.x1) / 2, cy = (road.y0 + road.y1) / 2, tries = 0;
  while (seeds.length < 52 && tries < 30000) {
    tries++;
    var x = rnd() * W, y = road.top + rnd() * (road.y1 - road.top);
    if (!onRoad(x, y)) continue;
    var d = Math.hypot((x - cx) / W, (y - cy) / H);
    if (rnd() > Math.exp(-d * 3) * 0.95 + 0.07) continue;
    seeds.push([x, y]);
  }
  var css = getComputedStyle(document.documentElement);
  var field = css.getPropertyValue('--field').trim(), accent = css.getPropertyValue('--accent').trim();
  ctx.fillStyle = '#fbfafa'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ece9ea';
  ctx.fillRect(0, road.y0, W, road.y1 - road.y0);
  ctx.fillRect(road.x0, road.top, road.x1 - road.x0, road.y0 - road.top);
  var step = 3, cols = Math.ceil(W / step), rows = Math.ceil(H / step);
  var lab = new Int16Array(cols * rows).fill(-1);
  for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
    var px = i * step + 1, py = j * step + 1;
    if (!onRoad(px, py)) continue;
    var best = 0, bd = Infinity;
    for (var k = 0; k < seeds.length; k++) {
      var dx = seeds[k][0] - px, dy = seeds[k][1] - py, dd = dx * dx + dy * dy;
      if (dd < bd) { bd = dd; best = k; }
    }
    lab[j * cols + i] = best;
  }
  ctx.fillStyle = field;
  for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
    var l = lab[j * cols + i]; if (l < 0) continue;
    var r = i + 1 < cols ? lab[j * cols + i + 1] : l, b = j + 1 < rows ? lab[(j + 1) * cols + i] : l;
    if ((r >= 0 && r !== l) || (b >= 0 && b !== l)) ctx.fillRect(i * step, j * step, 2, 2);
  }
  ctx.fillStyle = accent;
  seeds.forEach(function (s) { ctx.beginPath(); ctx.arc(s[0], s[1], 4, 0, Math.PI * 2); ctx.fill(); });
})();
