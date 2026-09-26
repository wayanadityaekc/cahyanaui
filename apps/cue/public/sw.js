// The service worker exists for two reasons only: Chrome will not offer "Add to
// Home Screen" without one that has a fetch handler, and a phone with no signal
// should get a readable page instead of the browser's error screen.
//
// IT IS DELIBERATELY NOT AN OFFLINE APP, and the reason is the deploy model.
// This site is push = live: main builds and force-pushes out/ to the host a few
// minutes later. A worker that served HTML from its cache would pin every
// installed guest to the markup they happened to have when they installed, and
// nothing we shipped afterwards could reach them - no price change, no fix, no
// new tour. That is the favicon cache problem in CLAUDE.md with the whole site
// in place of one icon, so:
//
//   HTML IS NEVER READ FROM CACHE. It is never even written to one.
//
// Cache-first is used for exactly one class of file: paths whose names already
// carry a content hash (/_next/static/) and the self-hosted fonts. A cached copy
// of those cannot be stale, because a changed file gets a changed name. Photos
// under /assets/images are NOT cached - their names are stable and Wayan
// replaces photos in place.
const VERSION = 'cue-v1';
const ASSETS = `${VERSION}-assets`;
const OFFLINE_URL = '/offline.html';

const hashed = (p) => p.startsWith('/_next/static/') || p.startsWith('/assets/fonts/');

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(ASSETS).then((c) => c.add(new Request(OFFLINE_URL, { cache: 'reload' })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  // Anything from an older VERSION goes. Bumping VERSION is the whole update
  // mechanism; there is no per-file invalidation to get wrong.
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // the API and PayPal answer for themselves

  // A page. Network, always. The cached offline page is the only fallback, and
  // it is only ever reached when the network itself failed.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (hashed(url.pathname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(req, copy));
        }
        return res;
      })),
    );
    return;
  }

  // Everything else - photos, style.css, the manifest - stays on the network and
  // is never stored, so replacing a file in place reaches everyone immediately.
});
