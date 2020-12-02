### Promise: then vs await

Consider p and f:
* p is a Promise 
* f is a function
(either variable or expression)

`p.then(f)` and `f(await p)` are exactly the same

1) navigator.getBattery() is a Promise

* `navigator.getBattery().then(display)`
* `display(await navigator.getBattery())`
are exactly the same

2) fetch(u) is a Promise where u is a URL <br>
The call on the Response `r.json()` is also a Promise

* `fetch(u).then(r => r.json()).then(display)`
* `r=await fetch(u); display(await r.json())`
are exactly the same
