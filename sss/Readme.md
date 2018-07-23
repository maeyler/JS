[Inspector](../inspector.html) 
yazılımı ile nesnelerin içindeki değerleri görebilir ve metodlarını çağırabiliriz

![resim](screen%20V1.4.png)

Nesnelerin denetimi için ekranda üç liste ve iki metin kutusu görüyoruz:

**list1** (Objects) incelenen nesneleri gösterir (program içindeki adı `objA`) <br>
Bütün işlemler, koyu renkle gösterilen seçilmiş nesne (`_`) üzerinde yapılır <br>
Ok tuşları ile ilerleyebilir, Delete tuşu (✘) ile seçilmiş nesneyi silebiliriz

Bu listeye yeni bir nesne eklemenin üç yolu var: <br>
• list2 içinde tıklanan koyu fontla yazılmış bir değer <br>
• list3 içinde tıklanan bir metod ile üretilen nesne <br>
• input içine girilen bir komut ile üretilen nesne

**list2** (Properties) seçilmiş nesnenin türünü ve içindeki değerleri gösterir <br>
Nesnenin türü _Iterable_ ise, adına tıklayarak nesneyi _Array_ halinde görebiliriz <br>
Koyu fontla yazılmış değerler başka bir nesneye işaret eder

**list3** (Methods) seçilmiş nesnenin metodlarını gösterir <br>
Bu metodlardan birine tıklayınca, hangi değerlerle çağrılacağını girmek gerekir <br>
Girilen değerler JS diline uygun olmalı: Değişken, sayı ya da String olabilir <br>
Seçilen metodun parametresi olmasa bile bir diyalog çıkar, vaz geçmek mümkün
 
**input** kutusu içine yazılan JavaScript komutu `eval()` ile değerlendirilir <br>
Girilen komut JS diline uygun olmalı (list3 için verilen kısıtlar geçerli) <br>
list1 içinde seçilmiş nesneye `_` değişkeni olarak erişebiliriz

**output** kutusunda ise yapılan son işlemin özeti görülür

### Ilk nesneler

Sayfa açılınca önce inspector.js kodu yüklenir <br>
HTML elemanları yapılır ve `init()` ile 7 adet nesne gösterilir:
```
function init() {
  let s = "Small is beautiful", d = new Date(), 
      a = [0, 11, "22", "abc"], b = new Set(a),
      c = {one: 123, two: "456", random: Math.random, 
         sqrt: Math.sqrt, power: Math.pow, pi: Math.PI,
         toString: (() => s)  //same as return s;
      }
  for (let x of [s, d, a, b, c, document, window]) 
      display(x);
}

• s is a String with 18 chars 
• d is a Date with nothing to display 
• a is an Array with 2 numbers and 2 strings 
• b is a Set with the same members as a 
• c is an Object with 3 properties and 4 methods 
• document is the HTML document currently open 
• window contains global variables related to this page
```

### Örnekler

Inspector yazılımı özellikle mobil cihazlar için geliştirildi <br>
Tarayıcıların console aracı ile bunlar zaten kolayca yapılır <br>

Zorluk sırasına göre dört örnek (üçü asenkron) görelim:

```
// işletim sistemi -- senkron
navigator.platform

// pil durumu -- hemen sonuç veren Promise
navigator.getBattery()

// GPS location -- bir iki saniye süren Callback
navigator.geolocation
_.getCurrentPosition(display)

// metin dosyası -- bir iki saniye süren Promise
fetch("hard/test/test.txt")  //remote file
_.text()   //returns String
```

### Önceki sürümler

[V0](SSS%20V0.html) HTML ve style komutları ile sayfanın görünümü yapıldı -- 3 saat

[V0.2](inspector%20V0.2.html) Temel özellikleri eklemek 170 satır koda sığdı -- 7 saat

