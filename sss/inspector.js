"use strict";
const VERSION = "V1.0";
const objA = [], objP = [], prop = [], meth = [];
var hist = [];    //object history -- global variables
var current = 0;  //current object index in list1 & objA
var co = 0;  //current object
function report(input, result) { 
    display(result); 
    let msg = trunc(input, 25)+trunc(" ⇒ "+result, 35); 
    console.log(msg); out.innerText = msg; 
    out.style.backgroundColor = "";
}
function reportError(e) {
    console.log(e); out.innerText = trunc(" "+e, 50); 
    out.style.backgroundColor = "pink";
}
function remove() {
    objA.splice(current, 1);
    list1.removeChild(list1.children[current]);
    displayItem(current);
}
function doMethod(met) {
    let obj = objA[current];
    let ff = obj[met]; //simpler than reflection
    if (!ff) ff = obj.__proto__[met];
    if (typeof ff != "function") return;
    let n = ff.length, arg = [];
    let s = "Enter ", w = "string without quotes ";
    if (n == 0) s += "optional "+w;
    if (n == 1) s += "the "+w;
    if (n >= 2) s += n+" strings separated by commas ";
    s = prompt(s+"in order to call "+met+"()");
    if (s == undefined || s == null) return; 
    arg = s.split(",");
    try {
        if (arg.length < n) throw(n+" arguments required");
        report(met+"("+arg+")", ff.apply(obj, arg));
    } catch(e) {
        reportError(e);
    }
}
function doClick(t) { //t is target, <ul> element
    let y = t.scrollTop + event.layerY;
    let h = t.firstChild.clientHeight + 2; //16px
    let k = Math.trunc(y/h);
    if (t == list1) {
        displayItem(k);
    } else if (t == list2) {
        display(objP[k]);
    } else if (t == list3) {
        doMethod(meth[k]);
    }
}
function previous() {
        let n = hist.length; if (n<2) return;
        hist.pop(); display(hist.pop()); 
}
function doKey() {
    //console.log(event.key, current);
    switch (event.key) {
      case "Delete":
        remove(); return;
      case "ArrowUp":
        displayItem(current-1); return;
      case "ArrowDown":
        displayItem(current+1); return;
      case "ArrowLeft": case "Backspace":
        previous(); return;
    }
}
function doInput(exp) {
    try {
        report(exp, eval(exp));
    } catch(e) {
        reportError(e);
    }
}
function trunc(f, M) { //if s is long, truncate to M chars
    let s = (f == null? "null" : f.toString());
    if (s.length > M+5) s = s.substring(0, M)+"...";
    return s;
}
function arrayToList(a, L) {
    const MAX = 25, LT = /</g;
    let list = "";
    for (let obj of a) {
        if (!obj) continue;
        let s = trunc(obj, 25).replace(LT, "&lt;");
        if (s.startsWith("* *")) //class name
             list += "<li class=cname>" + s.substring(3);
        else list += "<li>" + s;
    }
    L.innerHTML = list;
}
function display(f) {
    if (!f) return; let t = typeof f;
    if (t != "string" && t != "object") return;
    let i = objA.indexOf(f);
    if (i >= 0) {
        displayItem(i);
    } else {
        objA.push(f); arrayToList(objA, list1);
        displayItem(-1); 
    }
}
function selectCurrent(dark) {
    let c = list1.children[current]; if (!c) return;
    c.style.color = (dark? "white" : "");
    c.style.backgroundColor = (dark? "blue" : "");
}
function selectItem(c) {
    selectCurrent(false); current = c;
    if (c < 0) current = objA.length-1;
    if (c >= objA.length) current = 0;
    selectCurrent(true); 
}
function addProperty(key) {
    let obj = co[key];
    let s = obj.toString();
    if (typeof obj == "string") s = '"'+s+'"';
    s = key+": "+s;
    objP.push(obj); prop.push(s);
}
function addMethods(metA) {
    for (let m of metA) meth.push(m); 
}
function add_proto_() {
    if (typeof co == "string") 
  addMethods(["charAt", "concat", "replace", "search", "split", "substring"]);
    if (co instanceof Array) 
        addMethods(["indexOf", "join", "push", "pop", "reverse", "splice"]);
    if (co instanceof RegExp) { 
        addMethods(["test", "exec"]); addProperty("flags");
    }
    if (co instanceof Promise) meth.push("then");
}
function displayItem(c) {
    //co is global -- current object
    selectItem(c); co = objA[current];
    objP.length = 1; prop.length = 1; meth.length = 0;
    objP[0] = undefined; prop[0] = "* *"+co.constructor.name;
    for (let key in co) 
      try {
        if (key == "webkitStorageInfo") continue;
        let obj = co[key];
        if (typeof obj == "function") {
            meth.push(key);
        } else if (obj != null) {
            const LC = /[a-z0-9]/;
            //skip uppercase constants
            if (LC.test(key)) addProperty(key);
        }
      } catch(error) { //silently ignore
      }
    add_proto_(); list1.focus();
    arrayToList(prop, list2);
    arrayToList(meth, list3);
    let p = prop.length - 1, m = meth.length;
    let s = p+" properties and "+m+" methods";
    out.innerText = trunc(co, 25)+" — "+s; 
    let n = hist.length;
    if (hist[n-1] !== co) hist.push(co); 
    if (n > 50) hist.splice(0, 20);
}
