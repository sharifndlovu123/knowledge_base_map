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

/* Loading sheet: shown once per session (the head script in main.html sets html.bp-loading).
   Stays up for at least 0.9s so the line can draw, then fades out once the page has loaded. */
(function () {
  var root = document.documentElement, el = document.querySelector(".bp-load");
  if (!el || !root.classList.contains("bp-loading")) { return; }
  var start = Date.now(), done = false;
  function finish() {
    if (done) { return; }
    done = true;
    el.classList.add("bp-load--out");
    setTimeout(function () { root.classList.remove("bp-loading"); }, 350);
    try { sessionStorage.setItem("bp-seen", "1"); } catch (e) {}
  }
  function ready() { setTimeout(finish, Math.max(0, 900 - (Date.now() - start))); }
  if (document.readyState === "complete") { ready(); } else { window.addEventListener("load", ready); }
  setTimeout(finish, 3500);
  el.addEventListener("click", finish);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { finish(); } });
})();
