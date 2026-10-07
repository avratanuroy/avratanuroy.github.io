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
})();
