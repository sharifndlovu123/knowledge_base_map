/* Service worker: lets the site be installed and read offline.

   Network first, always. Every request goes through a plain fetch(), so the browser's HTTP
   cache and Cloudflare's Cache-Control headers apply exactly as they would without a service
   worker. The copy kept here is only a fallback for when the network fails, so a newly
   published note is never hidden behind a stale cached one.

   Cloudflare redirects /Page.html to /Page, so pages are stored under their final URL and
   looked up under either form. Stored copies are rebuilt without the "redirected" flag,
   because the browser refuses to answer a page navigation with a redirected response.

   Bump VERSION to drop everything cached by older workers. */
var VERSION = "kb-v2";
var CACHE = VERSION + "-pages";
// Cloudflare serves offline.html at /offline; a plain static server serves it at /offline.html
var OFFLINE = ["/offline", "/offline.html"];
var MAX_ENTRIES = 800;
var PRECACHE = ["/offline", "/assets/icons/icon-192.png", "/manifest.webmanifest"];
// Same origin plus the Google Fonts hosts the theme loads its typefaces from
var FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Misses must not abort the install, so add each file on its own. /offline.html is the
      // fallback for hosts that don't strip the extension.
      var tasks = PRECACHE.map(function (url) { return store(cache, url).catch(function () {}); });
      tasks.push(store(cache, "/offline.html").catch(function () {}));
      return Promise.all(tasks);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// A copy of the response that the browser will accept for any kind of request
function clean(response) {
  if (!response.redirected) { return Promise.resolve(response); }
  return response.blob().then(function (body) {
    return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
  });
}

// Fetch a URL and keep it under the URL it finally resolved to
function store(cache, url) {
  return fetch(url).then(function (response) {
    if (response.status !== 200) { throw new Error("not cacheable"); }
    return keep(cache, url, response);
  });
}

// Takes ownership of `response`: pass a clone if the original is still needed
function keep(cache, requestUrl, response) {
  var key = response.redirected ? response.url : requestUrl;
  return clean(response).then(function (copy) { return cache.put(key, copy); });
}

function trim(cache) {
  return cache.keys().then(function (keys) {
    var extra = keys.length - MAX_ENTRIES;
    return Promise.all(keys.slice(0, Math.max(extra, 0)).map(function (k) { return cache.delete(k); }));
  });
}

// The URLs a cached copy of this page could be filed under
function candidates(url) {
  var list = [url.href];
  var path = url.pathname;
  if (/\/index\.html$/.test(path)) { list.push(url.origin + path.replace(/index\.html$/, "")); }
  else if (/\.html$/.test(path)) { list.push(url.origin + path.replace(/\.html$/, "")); }
  return list;
}

function fromCache(url) {
  return caches.open(CACHE).then(function (cache) {
    return candidates(url).reduce(function (chain, key) {
      return chain.then(function (hit) { return hit || cache.match(key); });
    }, Promise.resolve(undefined));
  });
}

function offlinePage() {
  return caches.open(CACHE).then(function (cache) {
    return OFFLINE.reduce(function (chain, path) {
      return chain.then(function (hit) { return hit || cache.match(path); });
    }, Promise.resolve(undefined));
  });
}

function networkFirst(event) {
  var request = event.request;
  return fetch(request).then(function (response) {
    // Opaque responses (cross-origin stylesheets loaded without CORS) can't be inspected, but are safe to keep.
    // A navigation that hits a redirect comes back as "opaqueredirect" and is simply passed on; the
    // browser then follows it and the final URL is handled by its own fetch event.
    if (response && (response.status === 200 || response.type === "opaque")) {
      var copy = response.clone(); // must happen now, before the page starts reading the body
      event.waitUntil(caches.open(CACHE).then(function (cache) {
        return keep(cache, request.url, copy).then(function () { return trim(cache); });
      }).catch(function () {}));
    }
    return response;
  }).catch(function () {
    return fromCache(new URL(request.url)).then(function (cached) {
      if (cached) { return cached; }
      if (request.mode === "navigate") { return offlinePage(); }
      return Response.error();
    });
  });
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) { return; }
  var url = new URL(request.url);
  if (url.origin !== self.location.origin && FONT_HOSTS.indexOf(url.hostname) === -1) { return; }
  event.respondWith(networkFirst(event));
});
