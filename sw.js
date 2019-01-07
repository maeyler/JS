const CACHE ='JS2'
function installCB(e) {
  console.log('install', e.request);
}
self.addEventListener('install', installCB)

function save(req, resp) {
  if (!req.url.includes("github")) return resp;
  return caches.open(CACHE)
  .then(cache => {
    cache.put(req, resp.clone());
    return resp;
  }) 
  .catch(console.log)
}
function fetchCB(e) { //fetch first
  let req = e.request
  console.log(CACHE, req.url);
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => { return caches.match(req).then(r1 => r1) })
  )
}
self.addEventListener('fetch', fetchCB)

