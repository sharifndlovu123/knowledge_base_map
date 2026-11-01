/* Reading mode: a header button that hides the navigation and sets the note in a narrow, larger
   column. A floating bar adds smaller / larger text and an exit button. The choice is remembered
   in localStorage; the head script in overrides/main.html applies it before first paint. */
(function () {
  "use strict";

  var ROOT = document.documentElement;
  var KEY = "bp-reading", SIZE_KEY = "bp-reading-size";
  var STEPS = [1, 1.1, 1.2, 1.35, 1.5, 1.7]; // multiples of the normal body size
  var DEFAULT_STEP = 2;

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  var step = parseInt(read(SIZE_KEY), 10);
  if (isNaN(step) || step < 0 || step >= STEPS.length) { step = DEFAULT_STEP; }

  function reading() { return ROOT.classList.contains("bp-reading"); }

  function applySize() {
    ROOT.style.setProperty("--bp-read-scale", STEPS[step]);
    var smaller = document.querySelector(".bp-read-bar [data-act='smaller']");
    var larger = document.querySelector(".bp-read-bar [data-act='larger']");
    if (smaller) { smaller.disabled = step === 0; }
    if (larger) { larger.disabled = step === STEPS.length - 1; }
  }

  function sync() {
    var on = reading();
    var btn = document.querySelector(".bp-reader-btn");
    if (btn) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.title = on ? "Leave reading mode" : "Reading mode";
    }
  }

  function set(on) {
    ROOT.classList.toggle("bp-reading", on);
    write(KEY, on ? "1" : "0");
    sync();
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) { node.textContent = text; }
    return node;
  }

  function button() {
    var b = el("button", { type: "button", class: "md-header__button md-icon bp-reader-btn", "aria-pressed": "false", title: "Reading mode", "aria-label": "Reading mode" });
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    ["M3.5 5.5c2.7-1.1 5.4-1 8.5.8 3.1-1.8 5.8-1.9 8.5-.8v13c-2.7-1.1-5.4-1-8.5.8-3.1-1.8-5.8-1.9-8.5-.8z", "M12 6.3v13"].forEach(function (d) {
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });
    b.appendChild(svg);
    b.addEventListener("click", function () { set(!reading()); });
    return b;
  }

  function bar() {
    var wrap = el("div", { class: "bp-read-bar", role: "group", "aria-label": "Reading mode controls" });
    var smaller = el("button", { type: "button", "data-act": "smaller", "aria-label": "Smaller text", title: "Smaller text" }, "A−");
    var larger = el("button", { type: "button", "data-act": "larger", "aria-label": "Larger text", title: "Larger text" }, "A+");
    var exit = el("button", { type: "button", "data-act": "exit" }, "Exit");
    smaller.addEventListener("click", function () { step = Math.max(0, step - 1); write(SIZE_KEY, step); applySize(); });
    larger.addEventListener("click", function () { step = Math.min(STEPS.length - 1, step + 1); write(SIZE_KEY, step); applySize(); });
    exit.addEventListener("click", function () { set(false); });
    wrap.appendChild(smaller); wrap.appendChild(larger); wrap.appendChild(exit);
    return wrap;
  }

  // Idempotent: instant navigation can replace parts of the page, so this runs after every page change
  function ensure() {
    if (!document.querySelector(".bp-reader-btn")) {
      var anchor = document.querySelector('[data-md-component="palette"]') || document.querySelector(".md-header__title");
      if (anchor && anchor.parentNode) { anchor.parentNode.insertBefore(button(), anchor.nextSibling); }
    }
    if (!document.querySelector(".bp-read-bar")) { document.body.appendChild(bar()); }
    applySize();
    sync();
  }

  if (window.document$) { document$.subscribe(ensure); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", ensure); } else { ensure(); }
})();
