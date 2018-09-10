[Inspector](inspector.html) 
yazılımı ile nesnelerin içindeki değerleri görebilir ve metodlarını çağırabiliriz

![resim](screen.png)

Nesnelerin denetimi için ekranda üç liste ve iki metin kutusu görüyoruz:

**list1** (Objects) incelenen nesneleri gösterir (program içindeki adı `objA`) <br>
Bütün işlemler, koyu renkle gösterilen seçilmiş nesne (`_`) üzerinde yapılır <br>
Ok tuşları ile ilerleyebilir, Delete tuşu (✘) ile seçilmiş nesneyi silebiliriz

Bu listeye yeni bir nesne eklemenin üç yolu var: <br>
• list2 içinde tıklanan koyu fontla yazılmış bir değer <br>
• list3 içinde tıklanan bir metod ile üretilen nesne <br>
• input içine girilen bir komut ile üretilen nesne

**list2** (Properties) seçilmiş nesnenin türünü ve içindeki değerleri gösterir <br>
Nesnenin türü _Iterable_ ise, adına tıklayarak nesneyi _Array_ haline çevirebiliriz <br>
Koyu fontla yazılmış değerler başka bir nesneye işaret eder

**list3** (Methods) seçilmiş nesnenin metodlarını gösterir <br>
Bu metodlardan birine tıklayınca, hangi değerlerle çağrılacağını girmek gerekir <br>
Girilen değerler JS diline uygun olmalı: Değişken, sayı ya da String olabilir <br>
Seçilen metodun parametresi olmasa bile bir diyalog çıkar, vaz geçmek mümkün
 
**input** kutusu içine yazılan JavaScript komutu `eval()` ile değerlendirilir <br>
Girilen komut JS diline uygun olmalı (list3 için verilen kısıtlar geçerli) <br>
list1 içinde seçilmiş nesneye `_` değişkeni olarak erişebiliriz <br>
Bir önceki seçilmiş nesnenin adı ise `__`

**output** kutusunda yapılan son işlemin özeti görülür


### Ilk nesneler
Sayfa açılınca önce inspector.js kodu yüklenir <br>
HTML elemanları yapılır ve `init()` ile 8 adet nesne gösterilir:
```
var MENU, a, b, c;  //global variables
function init() {
    let s = "Small is beautiful", d = new Date(),
       len = 123, name = "Circle", pi = Math.PI, 
       sqrt = Math.sqrt, power = Math.pow;
    a = [0, 11, "22", "abc"]; b = new Set(a);
    c = {len, name, pi, sqrt, power};
    MENU = {s, d, a, b, c, window, navigator, document};
    Reflect.setPrototypeOf(MENU, Menu.prototype);
    display(MENU); 
}

• s is a String with 18 chars 
• d is a Date with no properties
• a is an Array with 2 numbers and 2 strings 
• b is a Set with the same members as a 
• c is an Object with 3 properties and 3 methods 
• document is the HTML document currently open 
• window contains global variables related to this page
* navigator gives information about the current browser
```

### Örnekler
Inspector yazılımı özellikle mobil cihazlar için geliştirildi <br>
Tarayıcıların console aracı ile bu işlemler PC'de kolayca yapılır <br>
Aynı işi mobil cihazlarda yapabilmek için bunun gibi bir yazılım gerekiyor

Zorluk sırasına göre birkaç örnek görelim:
```
// işletim sistemi -- senkron
navigator.platform

// pil durumu -- hemen sonuç veren Promise
navigator.getBattery()

// GPS location -- bir iki saniye süren Callback
navigator.geolocation
_.getCurrentPosition(display)

// yerel metin dosyası -- hemen sonuç veren Callback
// 'Choose Files' ile bir metin dosyası seçelim
// File seçili iken geri tuşuna bastıktan sonra:
_.readAsText(__)

// uzak metin dosyası -- bir iki saniye süren Promise
fetch("../hard/test.txt")  //remote file
_.text()   //returns String
```

### Önceki sürümler
Bu çalışmaya 2004 tarihli Small-Simple-Safe yazılımını örnek alarak başladım

[V0](evolve/SSS%20V0.html) HTML ve style komutları ile sayfanın görünümü yapıldı -- 3 saat

[V0.2](evolve/inspector%20V0.2.html) Temel özellikleri eklemek 170 satır koda sığdı -- 7 saat

