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

