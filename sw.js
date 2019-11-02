const CACHE ='JS2'
function installCB(e) {
  console.log(CACHE, e);
}
addEventListener('install', installCB)

function save(req, resp) {
  if (!req.url.includes("maeyler")) 
     return resp;
  return caches.open(CACHE)
  .then(cache => { // save request
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
addEventListener('fetch', fetchCB)

function activateCB(e) {
  console.log(CACHE, e);
}
addEventListener('activate', activateCB);

