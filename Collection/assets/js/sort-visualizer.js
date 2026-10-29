/* Sorting visualiser. Put <div class="sortviz" data-algo="bubble" data-values="6,3,8,2,9,1"></div> in a note.
   data-algo: bubble | selection | insertion | merge | quick | heap | counting | radix
   data-values: optional starting values (otherwise random); data-n: size when random (default 16). */
(function () {
  var NAMES = {
    bubble: "Bubble sort", selection: "Selection sort", insertion: "Insertion sort", merge: "Merge sort",
    quick: "Quick sort", heap: "Heap sort", counting: "Counting sort", radix: "Radix sort"
  };

  function swap(a, i, j) { var t = a[i]; a[i] = a[j]; a[j] = t; }

  /* Each algorithm is a generator: it changes `a` in place and yields what to highlight.
     c: compared, x: swapped, w: written, p: pivot, r: active range, t: caption. */
  var ALGOS = {
    bubble: function* (a, s) {
      var n = a.length;
      for (var i = 0; i < n - 1; i++) {
        var swapped = false;
        for (var j = 0; j < n - i - 1; j++) {
          yield { c: [j, j + 1], t: "Compare " + a[j] + " and " + a[j + 1] };
          if (a[j] > a[j + 1]) {
            swap(a, j, j + 1); swapped = true;
            yield { x: [j, j + 1], t: "Out of order, swap" };
          }
        }
        s.sorted.add(n - i - 1);
        if (!swapped) { break; }
      }
    },
    selection: function* (a, s) {
      var n = a.length;
      for (var i = 0; i < n - 1; i++) {
        var m = i;
        for (var j = i + 1; j < n; j++) {
          yield { c: [m, j], r: [i, n - 1], t: "Is " + a[j] + " smaller than the minimum so far (" + a[m] + ")?" };
          if (a[j] < a[m]) { m = j; }
        }
        if (m !== i) { swap(a, i, m); yield { x: [i, m], r: [i, n - 1], t: "Move the minimum to position " + i }; }
        s.sorted.add(i);
      }
    },
    insertion: function* (a, s) {
      var n = a.length;
      for (var i = 1; i < n; i++) {
        var j = i;
        while (j > 0) {
          yield { c: [j - 1, j], r: [0, i], t: "Compare " + a[j - 1] + " and " + a[j] };
          if (a[j - 1] > a[j]) { swap(a, j - 1, j); yield { x: [j - 1, j], r: [0, i], t: "Shift left" }; j--; }
          else { break; }
        }
      }
    },
    merge: function* (a, s) {
      function* sortRange(lo, hi) {
        if (lo >= hi) { return; }
        var mid = (lo + hi) >> 1;
        yield* sortRange(lo, mid);
        yield* sortRange(mid + 1, hi);
        var L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1), i = 0, j = 0, k = lo;
        while (i < L.length && j < R.length) {
          var left = L[i] <= R[j];
          a[k] = left ? L[i++] : R[j++];
          yield { cmp: true, w: [k], r: [lo, hi], t: "Merge: take " + a[k] + " from the " + (left ? "left" : "right") + " half" };
          k++;
        }
        while (i < L.length) { a[k] = L[i++]; yield { w: [k], r: [lo, hi], t: "Copy the rest of the left half" }; k++; }
        while (j < R.length) { a[k] = R[j++]; yield { w: [k], r: [lo, hi], t: "Copy the rest of the right half" }; k++; }
      }
      yield* sortRange(0, a.length - 1);
    },
    quick: function* (a, s) {
      function* sortRange(lo, hi) {
        if (lo > hi) { return; }
        if (lo === hi) { s.sorted.add(lo); return; }
        var pivot = a[hi], i = lo - 1;
        yield { p: hi, r: [lo, hi], t: "Pivot is " + pivot };
        for (var j = lo; j < hi; j++) {
          yield { p: hi, c: [j, hi], r: [lo, hi], t: "Is " + a[j] + " smaller than the pivot " + pivot + "?" };
          if (a[j] < pivot) {
            i++;
            if (i !== j) { swap(a, i, j); yield { p: hi, x: [i, j], r: [lo, hi], t: "Move " + a[i] + " to the small side" }; }
          }
        }
        if (i + 1 !== hi) { swap(a, i + 1, hi); yield { x: [i + 1, hi], r: [lo, hi], t: "Put the pivot in its final place" }; }
        s.sorted.add(i + 1);
        yield* sortRange(lo, i);
        yield* sortRange(i + 2, hi);
      }
      yield* sortRange(0, a.length - 1);
    },
    heap: function* (a, s) {
      var n = a.length;
      function* sift(size, i) {
        while (true) {
          var l = 2 * i + 1, r = l + 1, m = i;
          if (l < size) { yield { c: [l, m], r: [0, size - 1], t: "Sift down: compare child " + a[l] + " with " + a[m] }; if (a[l] > a[m]) { m = l; } }
          if (r < size) { yield { c: [r, m], r: [0, size - 1], t: "Sift down: compare child " + a[r] + " with " + a[m] }; if (a[r] > a[m]) { m = r; } }
          if (m === i) { return; }
          swap(a, i, m); yield { x: [i, m], r: [0, size - 1], t: "Swap parent with the larger child" };
          i = m;
        }
      }
      for (var i = (n >> 1) - 1; i >= 0; i--) { yield* sift(n, i); }
      for (var end = n - 1; end > 0; end--) {
        swap(a, 0, end); s.sorted.add(end);
        yield { x: [0, end], r: [0, end - 1], t: "Move the largest to its final place" };
        yield* sift(end, 0);
      }
    },
    counting: function* (a, s) {
      var max = Math.max.apply(null, a), cnt = [], i, v, k = 0;
      for (v = 0; v <= max; v++) { cnt.push(0); }
      for (i = 0; i < a.length; i++) { cnt[a[i]]++; yield { h: [i], t: "Count the value " + a[i] }; }
      for (v = 0; v <= max; v++) {
        for (var c = cnt[v]; c > 0; c--) { a[k] = v; yield { w: [k], t: "Write " + v + " (it occurs " + cnt[v] + (cnt[v] === 1 ? " time)" : " times)") }; k++; }
      }
    },
    radix: function* (a, s) {
      var max = Math.max.apply(null, a);
      for (var exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        var out = [], d, i, name = exp === 1 ? "ones" : exp === 10 ? "tens" : exp === 100 ? "hundreds" : "digit x" + exp;
        for (d = 0; d < 10; d++) { for (i = 0; i < a.length; i++) { if (Math.floor(a[i] / exp) % 10 === d) { out.push(a[i]); } } }
        for (i = 0; i < out.length; i++) {
          a[i] = out[i];
          yield { w: [i], t: "Sorted by the " + name + " digit: place " + out[i] + " (digit " + (Math.floor(out[i] / exp) % 10) + ")" };
        }
      }
    }
  };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text !== undefined) { e.textContent = text; }
    return e;
  }

  function randomData(n, big) {
    var out = [], hi = big ? 999 : 99;
    for (var i = 0; i < n; i++) { out.push(5 + Math.floor(Math.random() * (hi - 4))); }
    return out;
  }

  function mount(root) {
    root.setAttribute("data-ready", "1");
    root.textContent = "";
    var fixed = (root.getAttribute("data-values") || "").split(",").map(Number).filter(function (v) { return !isNaN(v) && v >= 0; });
    var algo = ALGOS[root.getAttribute("data-algo")] ? root.getAttribute("data-algo") : "bubble";
    var n = parseInt(root.getAttribute("data-n"), 10) || (fixed.length || 16);
    var base = fixed.length ? fixed.slice() : randomData(n, algo === "radix");
    var a, gen, state, ev, timer = null, cmp, swp, wr, done;

    var bar = el("div", "sortviz__bar");
    var select = el("select", "sortviz__select");
    select.setAttribute("aria-label", "Algorithm");
    Object.keys(NAMES).forEach(function (k) {
      var o = el("option", "", NAMES[k]); o.value = k; if (k === algo) { o.selected = true; } select.appendChild(o);
    });
    var play = el("button", "sortviz__btn", "Play");
    var step = el("button", "sortviz__btn", "Step");
    var reset = el("button", "sortviz__btn", "Reset");
    var shuffle = el("button", "sortviz__btn", "Shuffle");
    [play, step, reset, shuffle].forEach(function (b) { b.type = "button"; });
    var speed = el("input", "sortviz__speed");
    speed.type = "range"; speed.min = "1"; speed.max = "10"; speed.value = "6";
    speed.setAttribute("aria-label", "Speed");
    [select, play, step, reset, shuffle, speed].forEach(function (c) { bar.appendChild(c); });

    var bars = el("div", "sortviz__bars");
    var caption = el("div", "sortviz__caption");
    caption.setAttribute("role", "status");
    caption.setAttribute("aria-live", "polite");
    var stats = el("div", "sortviz__stats");
    root.appendChild(bar); root.appendChild(bars); root.appendChild(caption); root.appendChild(stats);

    function build() {
      bars.textContent = "";
      var max = Math.max.apply(null, a);
      a.forEach(function (v, i) {
        var b = el("div", "sortviz__col");
        b.style.height = Math.max(4, (v / max) * 100) + "%";
        b.setAttribute("data-v", v);
        if (a.length <= 16) { b.appendChild(el("span", "sortviz__num", String(v))); }
        bars.appendChild(b);
      });
    }

    function paint() {
      var cols = bars.children, max = Math.max.apply(null, base);
      for (var i = 0; i < cols.length; i++) {
        var cls = "sortviz__col", e = ev || {};
        if (done || state.sorted.has(i)) { cls += " is-sorted"; }
        else if (e.r && i >= e.r[0] && i <= e.r[1]) { cls += " is-range"; }
        if (e.c && e.c.indexOf(i) >= 0 || e.h && e.h.indexOf(i) >= 0) { cls += " is-compare"; }
        if (e.x && e.x.indexOf(i) >= 0) { cls += " is-swap"; }
        if (e.w && e.w.indexOf(i) >= 0) { cls += " is-write"; }
        if (e.p === i) { cls += " is-pivot"; }
        cols[i].className = cls;
        cols[i].style.height = Math.max(4, (a[i] / max) * 100) + "%";
        cols[i].setAttribute("data-v", a[i]);
        var num = cols[i].firstChild; if (num) { num.textContent = a[i]; }
      }
      stats.textContent = "Comparisons: " + cmp + "   Swaps: " + swp + "   Writes: " + wr;
      play.disabled = step.disabled = done;
    }

    function start() {
      pause();
      a = base.slice(); state = { sorted: new Set() }; ev = null; cmp = swp = wr = 0; done = false;
      gen = ALGOS[select.value](a, state);
      caption.textContent = "Press Play or Step to run " + NAMES[select.value] + ".";
      build(); paint();
    }

    function advance() {
      var r = gen.next();
      if (r.done) {
        done = true; ev = null;
        caption.textContent = "Sorted. " + cmp + " comparisons, " + swp + " swaps, " + wr + " writes.";
        pause(); paint(); return false;
      }
      ev = r.value;
      if (ev.c || ev.cmp) { cmp++; }
      if (ev.x) { swp++; }
      if (ev.w) { wr++; }
      caption.textContent = ev.t || "";
      paint();
      return true;
    }

    function pause() { if (timer) { clearTimeout(timer); timer = null; } play.textContent = "Play"; }
    function tick() { if (advance()) { timer = setTimeout(tick, 700 / Math.pow(1.6, +speed.value - 1)); } }
    function resume() { if (done) { return; } play.textContent = "Pause"; tick(); }

    play.addEventListener("click", function () { if (timer) { pause(); } else { resume(); } });
    step.addEventListener("click", function () { pause(); advance(); });
    reset.addEventListener("click", start);
    shuffle.addEventListener("click", function () { base = randomData(base.length, select.value === "radix"); start(); });
    select.addEventListener("change", function () {
      if (select.value === "radix" && Math.max.apply(null, base) < 100 && !fixed.length) { base = randomData(base.length, true); }
      start();
    });

    /* stop animating once the diagram has left the page (instant navigation) */
    new MutationObserver(function () { if (!root.isConnected) { pause(); } }).observe(document.body, { childList: true, subtree: true });
    start();
  }

  function scan() {
    document.querySelectorAll(".sortviz:not([data-ready])").forEach(mount);
  }
  if (window.document$) { document$.subscribe(scan); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", scan); } else { scan(); }
})();
