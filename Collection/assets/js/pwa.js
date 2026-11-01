/* Installable app support: registers the service worker and keeps the browser's
   theme colour (address bar / status bar) in step with the chosen colour scheme. */
(function () {
  "use strict";

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () {});
    });
  }

  function syncThemeColour() {
    var meta = document.querySelector('meta[name="theme-color"]');
    var paper = getComputedStyle(document.body).getPropertyValue("--bp-paper").trim();
    if (meta && paper) { meta.setAttribute("content", paper); }
  }

  document.addEventListener("DOMContentLoaded", function () {
    syncThemeColour();
    new MutationObserver(syncThemeColour).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
  });
})();
