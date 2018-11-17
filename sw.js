const CACHE ='JS'
const FILES = [
  '/JS/', '/JS/sss/',
  '/JS/index.html',
  '/JS/README',
  '/JS/sss/inspector.html',
  '/JS/sss/inspector.css',
  '/JS/sss/inspector.js',
  '/JS/sss/Readme',
  '/JS/sss/Turkish'
]
function installCB(e) {
  console.log('install', e);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
self.addEventListener('install', installCB)

function save(req, resp) {
  return caches.open(CACHE)
  .then(cache => {
    cache.put(req, resp.clone());
    return resp;
  }) 
  .catch(console.log)
}
function fetchCB(e) { //fetch first
  let req = e.request
  console.log('fetch', req.url);
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => { return caches.match(req).then(r1 => r1) })
  )
}
self.addEventListener('fetch', fetchCB)

