const CACHE ='files'
const FILES = [
  '/JS/index.html',
  '/JS/README.md',
  '/JS/sss/inspector.html',
  '/JS/sss/inspector.css',
  '/JS/sss/inspector.js',
  '/JS/sss/Readme.md',
  '/JS/sss/Turkish.md'
]
function installCB(e) {
  console.log('install', e);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
 )
}
function fetchCB(e) {
  let req = e.request
  console.log('fetch', req.url);
  function save(resp) {
    console.log('save', req.url);
    return caches.open(CACHE)
    .then(cache => {
      cache.put(req, resp.clone());
      return resp;
    }) 
    .catch(console.log)
  }
  e.respondWith(
    caches.match(req)
    .then(response => response || fetch(req).then(save))
    .catch(console.log)
  )
}
self.addEventListener('install', installCB)
self.addEventListener('fetch', fetchCB)

