/* Service worker: lets the site be installed and read offline.

   Network first, always. Every request goes through a plain fetch(), so the browser's HTTP
   cache and Cloudflare's Cache-Control headers apply exactly as they would without a service
   worker. The copy kept here is only a fallback for when the network fails, so a newly
   published note is never hidden behind a stale cached one.

   Bump VERSION to drop everything cached by older workers. */
var VERSION = "kb-v1";
var CACHE = VERSION + "-pages";
var OFFLINE = "/offline.html";
var MAX_ENTRIES = 800;
var PRECACHE = [OFFLINE, "/assets/icons/icon-192.png", "/manifest.webmanifest"];
// Same origin plus the Google Fonts hosts the theme loads its typefaces from
var FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // One miss must not abort the install, so add the files individually
      return Promise.all(PRECACHE.map(function (url) { return cache.add(url).catch(function () {}); }));
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

function trim(cache) {
  return cache.keys().then(function (keys) {
    var extra = keys.length - MAX_ENTRIES;
    return Promise.all(keys.slice(0, Math.max(extra, 0)).map(function (k) { return cache.delete(k); }));
  });
}

function networkFirst(event) {
  var request = event.request;
  return fetch(request).then(function (response) {
    // Opaque responses (cross-origin stylesheets loaded without CORS) can't be inspected, but are safe to keep
    if (response && (response.status === 200 || response.type === "opaque")) {
      var copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(function (cache) {
        return cache.put(request, copy).then(function () { return trim(cache); });
      }));
    }
    return response;
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      if (cached) { return cached; }
      if (request.mode === "navigate") { return caches.match(OFFLINE); }
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
