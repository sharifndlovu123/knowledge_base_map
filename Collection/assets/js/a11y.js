/* Give each code block's action group a unique accessible name (Material leaves them unlabelled). */
(function () {
  function label() {
    document.querySelectorAll(".md-code__nav").forEach(function (n, i) {
      n.setAttribute("aria-label", "Code actions " + (i + 1));
    });
  }
  if (window.document$) { document$.subscribe(label); }
  else { document.addEventListener("DOMContentLoaded", label); }
})();
