"use strict";
const VERSION = "V1.3", ITERABLE = new Object();
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
    let s = "Enter ";
    if (n == 0) s += "optional arguments "; 
    if (n == 1) s += "the argument ";
    if (n >= 2) s += n+" arguments separated by commas ";
    let arg = "("; while (--n > 0) arg += ", "; arg += ")";
    arg = prompt(s+"in order to call "+met+"()", arg);
    if (arg) try {
        let cmd = "co."+met+arg;
        if (arg[0] != "(" || !arg.endsWith(")")) 
             reportError(Error(cmd));
        else report(cmd, eval(cmd));
    } catch(e) {
        reportError(e);
    }
}
function doClick2() { //target == list2
    let k = lineNumber(list2), obj = objP[k];
    if (obj === ITERABLE) 
         display(objToArray(co));
    else display(obj);
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
function trunc(s, M) { //if s is long, truncate to M chars
    if (s == null) s = "null";
    if (s.length > M+5) s = s.substring(0, M)+"...";
    return s;
}
function objToArray(obj) {
    let a = []; for (let x of obj) a.push(x); return a;
}
function objToString(obj) {
    const LT = /</g;
    let s = obj.toString().replace(LT, "&lt;");
    if (typeof obj == "string") s = '"'+s+'"';
    else if (obj instanceof Array) s = '['+s+']';
    else if (obj instanceof Set) s = '{'+objToArray(obj)+'}';
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
        f.then(display, reportError); console.log(f);
        out.innerText = "A Promise was made";
        out.style.backgroundColor = "cyan"; return;
    }
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
    if (co instanceof Set) 
        addMethods(["add", "clear", "delete", "has", "values"]);
    if (co instanceof RegExp) { 
        addMethods(["test", "exec"]); addProperty("flags");
    }
    /*if (co instanceof Error) { 
        addProperty("fileName"); addProperty("stack");
    }*/
}
function displayItem(c) {
    //co is global -- current object
    selectItem(c); co = objA[current];
    objP.length = 1; prop.length = 1; meth.length = 0;
    objP[0] = ITERABLE; prop[0] = "* *"+co.constructor.name;
    if (co[Symbol.iterator]) prop[0] += " — Iterable"
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
    let p = prop.length-1, m = meth.length;
    let s = p+" properties and "+m+" methods";
    out.innerText = trunc(co.toString(), 25)+" — "+s; 
    out.style.backgroundColor = "";
    let n = hist.length;
    if (hist[n-1] !== co) hist.push(co); 
    if (n > 50) hist.splice(0, 20);
}
