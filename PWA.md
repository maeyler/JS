## PWA Nasıl Yapılır
Progressive Web App: Uygulama gibi davranan ve çevrim dışı (off-line) çalışabilen web sayfalarına PWA (web uygulaması) diyoruz. Bu sitenin ana sayfasını PWA haline getiren adımları burada özetliyoruz.

### Güzel Bir Örnek Her Şeyi Anlatıyor
Web'in tarihçesini anlatan şu kitap, [Resilient Web Design](https://resilientwebdesign.com/) aynı zamanda iyi bir PWA olarak incelemeye değer.

Chrome gibi bir tarayıcı ile açarak kitabı uygulama halinde kaydedebilirsiniz. Başka bir şey indirmeye gerek yok, çevrim dışı kullabilirsiniz. Kitabın içeriği değişse bile, tekrar çevrim içi olunca sayfalar güncellenecektir.

### PWA -- 1. Safha
Sayfanın Android/Chrome altında web uygulaması olması için iki adım yeterli:

1. `manifest.json` dosyası ile birlikte ana sayfaya tek satır: <br>
`<link rel="manifest" href="manifest.json">`
```
{
  "name": "JavaScript samples",
  "start_url": "/JS/index.html",
  "display": "standalone",
  "background_color": "cyan",
  "icons": [
    {
      "src": "images/JS.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```
2. Gerekli icon'lar (bir tane yeterli)

Büyük (512x512) icon varsa, uygulama yüklenirken sistem onu kullanabilir

![JS icon](images/JS.png)

### Cache (ön-bellek) Kullanımı
Bir web sayfası uzaktaki bir kaynağa (metin, resim, vb) erişmek istediğinde, tarayıcıya fetch talebi gönderir. Tarayıcı, 'http GET' mesajı ile uzaktaki kaynağı indirir ve gelen byte'ları sayfaya verir. Bu arada tarayıcının da bir ön-bellek kullandığını biliyoruz ama geliştiriciler bu belleğe erişemiyor.

![Cache Usage](images/cache.png)

Bir *web uygulaması* benzeri bir talep yaptığında, _service worker_ araya girer. Cevabı ya kendi ön-belleğinde bulur ya da tarayıcıdan ister.

### PWA -- 2. Safha
Masa üstünde uygulama statüsü kazanmak için ayrıca bir _service worker_ eklemek gerekiyor: `navigator.serviceWorker.register('/JS/sw.js')`

Uygulamayı çevrim dışı kullanabilmek için iki adım daha atalım:

3. `install` olayları için bir dinleyici: statik dosyaları en başta ön-belleğe alır
```
const CACHE ='JS'
const FILES = ['/JS/', '/JS/sss/', '/JS/index.html', ...]
function installCB(e) {
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
self.addEventListener('install', installCB)
```
4. `fetch` olayları için bir dinleyici: dosyayı önce ön-bellekte arar, bulamazsa fetch talebi gönderir
```
function cacheCB(e) { //cache first
  let req = e.request
  e.respondWith(
    caches.match(req)
    .then(r1 => r1 || fetch(req))
    .catch(console.log)
  )
}
self.addEventListener('fetch', cacheCB)
```

### Otomatik Cache
Yukarıda gösterilen "önce cache" yaklaşımı, zaman içinde değişmeyen statik kaynaklar için iyi bir çözüm. Mesela, arşiv dosyaları ya da kitap bölümleri gibi.
Zaman içinde değişen bir içerik söz konusu ise, daha farklı davranılır: "önce fetch". Kaynak tarayıcıdan istenir ve gelen bilgi ön-belleğe kaydedilir. Çevrim dışı olduğu için cevap gelmezse ön-bellekteki dosya ile yetinilir.
```
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
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => { return caches.match(req).then(r1 => r1) })
  )
}
self.addEventListener('fetch', fetchCB)
```

### Gerekli Dosyalar
* `index.html` (değişecek)
* `manifest.json` (PWA bilgisi)
* `images/JS.png` (icon)
* `sw.js` (service worker)

### Referanslar
* [Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
* [Building a PWA](https://medium.freecodecamp.org/progressive-web-apps-102-building-a-progressive-web-app-from-scratch-397b72168040)

