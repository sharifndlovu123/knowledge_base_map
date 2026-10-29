/* Diagram viewer: every Mermaid diagram gets an "Expand" button (clicking the diagram works too).
   It opens a full-screen overlay with zoom (wheel, pinch, + / -) and pan (drag, arrow keys).
   Keys: Esc close, + / - zoom, 0 fit, 1 actual size, F full screen. */
(function () {
  /* Material renders each diagram into a *closed* shadow root, which hides the SVG from page scripts.
     Open the root for diagram hosts only (div.mermaid), so the viewer can read the SVG. This must run
     before Material renders, which it does: Material loads Mermaid asynchronously. */
  var attach = Element.prototype.attachShadow;
  if (attach && !attach.mmz) {
    Element.prototype.attachShadow = function (init) {
      if (this.classList && this.classList.contains("mermaid")) { init = Object.assign({}, init, { mode: "open" }); }
      return attach.call(this, init);
    };
    Element.prototype.attachShadow.mmz = true;
  }

  var MIN = 0.1, MAX = 12;
  var overlay, stage, box, readout, fsBtn, lastFocus;
  var s = 1, x = 0, y = 0, moved = false, open = false;
  var pointers = {}, pinch = null, queued = false;

  function clamp(v) { return Math.min(MAX, Math.max(MIN, v)); }

  function paint() {
    box.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
    readout.textContent = Math.round(s * 100) + "%";
  }

  function fit() {
    var sw = stage.clientWidth, sh = stage.clientHeight, w = box.offsetWidth, h = box.offsetHeight;
    if (!w || !h) { return; }
    s = Math.min(6, clamp(Math.min(sw / w, sh / h) * 0.94));
    x = (sw - w * s) / 2;
    y = (sh - h * s) / 2;
    moved = false;
    paint();
  }

  /* zoom keeping the point (cx, cy), measured from the stage's top-left, fixed on screen */
  function zoomAt(factor, cx, cy) {
    var ns = clamp(s * factor);
    x = cx - (cx - x) * (ns / s);
    y = cy - (cy - y) * (ns / s);
    s = ns;
    moved = true;
    paint();
  }

  function centre() { return [stage.clientWidth / 2, stage.clientHeight / 2]; }
  function zoomBy(f) { var c = centre(); zoomAt(f, c[0], c[1]); }
  function actual() { var c = centre(); zoomAt(1 / s, c[0], c[1]); }
  function pan(dx, dy) { x += dx; y += dy; moved = true; paint(); }

  function btn(label, aria, handler) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "mmz__btn";
    b.textContent = label;
    b.setAttribute("aria-label", aria);
    b.addEventListener("click", handler);
    return b;
  }

  function toggleFullscreen() {
    try {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else if (overlay.requestFullscreen) { overlay.requestFullscreen(); }
    } catch (e) {}
  }

  function build() {
    if (overlay) { return; }
    overlay = document.createElement("div");
    overlay.className = "mmz";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Diagram viewer");

    var bar = document.createElement("div");
    bar.className = "mmz__bar";
    readout = document.createElement("span");
    readout.className = "mmz__readout";
    var hint = document.createElement("span");
    hint.className = "mmz__hint";
    hint.textContent = "Scroll or pinch to zoom · drag to pan · Esc to close";
    fsBtn = btn("Full screen", "Toggle full screen", toggleFullscreen);
    if (!document.fullscreenEnabled) { fsBtn.hidden = true; }
    var close = btn("Close", "Close diagram viewer", closeViewer);
    close.className += " mmz__btn--close";

    bar.appendChild(btn("−", "Zoom out", function () { zoomBy(1 / 1.4); }));
    bar.appendChild(btn("+", "Zoom in", function () { zoomBy(1.4); }));
    bar.appendChild(btn("Fit", "Fit diagram to screen", fit));
    bar.appendChild(btn("100%", "Actual size", actual));
    bar.appendChild(readout);
    bar.appendChild(hint);
    bar.appendChild(fsBtn);
    bar.appendChild(close);

    stage = document.createElement("div");
    stage.className = "mmz__stage";
    stage.tabIndex = 0;
    box = document.createElement("div");
    box.className = "mmz__box";
    stage.appendChild(box);

    overlay.appendChild(bar);
    overlay.appendChild(stage);
    document.body.appendChild(overlay);

    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      var d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomAt(Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    stage.addEventListener("pointerdown", function (e) {
      stage.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      stage.classList.add("mmz__stage--drag");
      pinch = null;
    });
    stage.addEventListener("pointermove", function (e) {
      var p = pointers[e.pointerId];
      if (!p) { return; }
      var ids = Object.keys(pointers);
      if (ids.length === 1) {
        pan(e.clientX - p.x, e.clientY - p.y);
      } else if (ids.length === 2) {
        var a = pointers[ids[0]], b = pointers[ids[1]];
        var nx = ids[0] === String(e.pointerId) ? e.clientX : a.x;
        var ny = ids[0] === String(e.pointerId) ? e.clientY : a.y;
        var mx = ids[1] === String(e.pointerId) ? e.clientX : b.x;
        var my = ids[1] === String(e.pointerId) ? e.clientY : b.y;
        var dist = Math.hypot(nx - mx, ny - my), r = stage.getBoundingClientRect();
        var cx = (nx + mx) / 2 - r.left, cy = (ny + my) / 2 - r.top;
        if (pinch) {
          x += cx - pinch.cx;
          y += cy - pinch.cy;
          zoomAt(dist / pinch.dist, cx, cy);
        }
        pinch = { dist: dist, cx: cx, cy: cy };
      }
      p.x = e.clientX;
      p.y = e.clientY;
    });
    function release(e) {
      delete pointers[e.pointerId];
      pinch = null;
      if (!Object.keys(pointers).length) { stage.classList.remove("mmz__stage--drag"); }
    }
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);

    document.addEventListener("keydown", function (e) {
      if (!open) { return; }
      var k = e.key;
      if (k === "Escape") { closeViewer(); }
      else if (k === "+" || k === "=") { zoomBy(1.4); }
      else if (k === "-" || k === "_") { zoomBy(1 / 1.4); }
      else if (k === "0") { fit(); }
      else if (k === "1") { actual(); }
      else if (k === "f" || k === "F") { toggleFullscreen(); }
      else if (k === "ArrowLeft") { pan(60, 0); }
      else if (k === "ArrowRight") { pan(-60, 0); }
      else if (k === "ArrowUp") { pan(0, 60); }
      else if (k === "ArrowDown") { pan(0, -60); }
      else if (k === "Tab") { trapFocus(e); }
      else { return; }
      if (k !== "Tab") { e.preventDefault(); }
    });

    window.addEventListener("resize", function () { if (open && !moved) { fit(); } });
    document.addEventListener("fullscreenchange", function () {
      fsBtn.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
      if (open && !moved) { setTimeout(fit, 50); }
    });
  }

  function trapFocus(e) {
    var items = Array.prototype.filter.call(overlay.querySelectorAll("button, [tabindex]"), function (n) { return !n.hidden; });
    if (!items.length) { return; }
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  /* the diagram's SVG: inside the shadow root when Material rendered it, else in the element itself */
  function findSvg(host) { return (host.shadowRoot || host).querySelector("svg"); }

  function openViewer(wrap) {
    var host = wrap.querySelector(".mermaid"), svg = host && findSvg(host);
    if (!svg) { return; }
    build();
    var clone = svg.cloneNode(true);
    var vb = svg.viewBox && svg.viewBox.baseVal, r = svg.getBoundingClientRect();
    var w = vb && vb.width ? vb.width : r.width, h = vb && vb.height ? vb.height : r.height;
    clone.removeAttribute("style");
    clone.setAttribute("width", w);
    clone.setAttribute("height", h);
    if (!clone.getAttribute("viewBox")) { clone.setAttribute("viewBox", "0 0 " + w + " " + h); }
    box.textContent = "";
    box.appendChild(clone);

    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add("mmz-lock");
    open = true;
    pointers = {};
    fit();
    stage.focus();
  }

  function closeViewer() {
    if (!open) { return; }
    open = false;
    if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
    overlay.hidden = true;
    document.documentElement.classList.remove("mmz-lock");
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  /* Mermaid renders after load (and again after instant navigation), so look for new diagrams
     whenever the page changes. Each diagram is wrapped so the button sits outside the shadow root. */
  function enhance() {
    queued = false;
    document.querySelectorAll(".md-typeset .mermaid").forEach(function (host) {
      if (!findSvg(host) || (host.parentNode && host.parentNode.classList.contains("mmz-wrap"))) { return; }
      var wrap = document.createElement("div");
      wrap.className = "mmz-wrap";
      host.parentNode.insertBefore(wrap, host);
      wrap.appendChild(host);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mmz-open";
      b.textContent = "Expand";
      b.setAttribute("aria-label", "Expand diagram to full screen");
      b.addEventListener("click", function (e) { e.stopPropagation(); openViewer(wrap); });
      wrap.appendChild(b);
      wrap.addEventListener("click", function () {
        var sel = window.getSelection && window.getSelection().toString();
        if (!sel) { openViewer(wrap); }
      });
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(enhance); } }

  function start() {
    queue();
    new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
  }
  if (window.document$) { document$.subscribe(function () { closeViewer(); queue(); }); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); }
  else { start(); }
})();
