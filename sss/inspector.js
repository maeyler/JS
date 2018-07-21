"use strict";
const VERSION = "V1.2";
const objA = [], objP = [], prop = [], meth = [];
var hist = [];    //object history -- global variables
var current = 0;  //current object index in list1 & objA
var co = 0;  //current object
function report(input, result) { 
    display(result); 
    let msg = trunc(input, 25)+trunc(" ⇒ "+result, 40); 
    console.log(msg); out.innerText = msg; 
    out.style.backgroundColor = "";
}
function reportError(e) {
    console.log(e); out.innerText = trunc(" "+e, 60); 
    out.style.backgroundColor = "pink";
}
function doMethod(met) {
    //co = objA[current];
    let ff = co[met]; //simpler than reflection
    if (!ff) ff = co.__proto__[met];
    if (typeof ff != "function") return;
    let n = ff.length;
    let s = "Enter "+n+" arguments separated by commas ";
    let arg = "("; while (--n > 0) arg += ", "; arg += ")";
    arg = prompt(s+"in order to call "+met+"()", arg);
    if (arg) try {
        if (arg[0] != "(" || !arg.endsWith(")")) 
            throw (Error(arg));
        let cmd = "co."+met+arg;
        report(cmd, eval(cmd));
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
function remove() {
    objA.splice(current, 1);
    list1.removeChild(list1.children[current]);
    previous();
}
function doKey() {
    //console.log(event.key, current);
    switch (event.key) {
      case "Delete":
        remove(); return;
      case "ArrowUp":
        event.preventDefault();
        displayItem(current-1); return;
      case "ArrowDown":
        event.preventDefault();
        displayItem(current+1); return;
      case "ArrowLeft": case "Backspace":
        previous(); return;
    }
}
function doEnter() {
    if (event.key == "Enter") try {
        event.preventDefault();
        let exp = inp.value;
        report(exp, eval(exp));
    } catch(e) {
        reportError(e);
    }
}
function doInput() {
    console.log(event);
}
function trunc(s, M) { //if s is long, truncate to M chars
    if (s == null) s = "null";
    if (s.length > M+5) s = s.substring(0, M)+"...";
    return s;
}
function objToString(obj) {
    const LT = /</g;
    let s = obj.toString().replace(LT, "&lt;");
    if (typeof obj == "string") s = '"'+s+'"';
    else if (obj instanceof Array) s = '['+s+']';
    //else if (obj instanceof Set) s = '{'+s+'}';
    return s;
}
function arrayToList(a, L) {
    const MAX = 30, OBJ = "[object ", RB = "]";
    let list = "";
    for (let obj of a) {
        if (!obj) continue;
        let s = (L == list1? objToString(obj) : obj);
        s = trunc(s, MAX);
        if (s.includes(OBJ)) {
          s = s.replace(OBJ, "<B>");
          if (s.includes(RB))
            s = s.replace(RB, "</B>");
          else s = s+"</B>";
        }
        if (s.startsWith("* *")) //class name
             list += "<li class=cname>" + s.substring(3);
        else list += "<li>" + s;
    }
    L.innerHTML = list;
}
function display(f) {
    if (!f) return; let t = typeof f;
    if (t != "string" && t != "object") return;
    if (f instanceof Promise) { //nothing to display in f
        f.then(display, reportError);
        out.innerText = "A Promise was made - takes time";
        out.style.backgroundColor = "cyan"; return;
    }
    /*if (f instanceof Symbol.iterator) {
        a = []; for (let x of f) a.push(x); f = a;
    }*/
    let i = objA.indexOf(f);
    if (i >= 0) {
        displayItem(i);
    } else {
        objA.push(f); arrayToList(objA, list1);
        displayItem(-1); 
    }
    return f;
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
    let s = key +": "+ objToString(obj);
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
    out.innerText = trunc(co.toString(), 25)+" — "+s; 
    out.style.backgroundColor = "";
    let n = hist.length;
    if (hist[n-1] !== co) hist.push(co); 
    if (n > 50) hist.splice(0, 20);
}
