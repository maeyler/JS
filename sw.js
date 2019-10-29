const CACHE ='JS2'
const FILES = [
  '/JS/',
  '/JS/index.html',
  '/JS/README',
  '/JS/Java to JS',
  '/JS/PWA',
  '/JS/PWA_EN',
  '/JS/images/JS.png',
  '/JS/manifest.json'
]
function installCB(e) {
  console.log(CACHE, e);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.err)
  )
}
self.addEventListener('install', installCB)

function save(req, resp) {
  if (!req.url.host.includes("maeyler")) 
     return resp;
  return caches.open(CACHE)
  .then(cache => {
    cache.put(req, resp.clone());
    return resp;
  }) 
  .catch(console.err)
}
function report(req) {
  console.log(CACHE+' matches '+req.url)
  return req
}
function fetchCB(e) { //fetch first
  let req = e.request
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => caches.match(req).then(report))
  )
}
self.addEventListener('fetch', fetchCB)

function activateCB(e) {
  console.log(CACHE, e);
}
addEventListener('activate', activateCB);

