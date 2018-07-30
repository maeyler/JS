"use strict";
const VERSION = "V1.6", ITERABLE = new Object();
const MAX_CHARS = 28, MAX_PROP = 1000;
const objA = [], objP = [];
var hist = [];    //object history -- global variable
var current = 0;  //current object index in list1 & objA
var _  = "";  //current object
var __ = "";  //previous object
function makeVisible(t, val) {
    t.style.visibility = val? "visible" : "";
    if (val) setTimeout(hideTips, 2500);
}
function hideTips() {
    prev.style.visibility = "";
    dele.style.visibility = "";
}
function report(input, result) { 
    let msg = trunc(input, MAX_CHARS);
    if (result != undefined) {
        display(result);
        msg += trunc(" ⇒ "+result, 2*MAX_CHARS); 
    }
    console.log(msg); out.innerText = msg; 
    out.style.backgroundColor = "";
}
function reportError(e) {
    console.log(e); 
    out.innerText = trunc(" "+e, 4*MAX_CHARS); 
    out.style.backgroundColor = "pink";
}
function doMethod(met) { //target == list3
    //let met = list3.children[c].innerText;
    //_ = objA[current];
    let ff = _[met]; //simpler than reflection
    if (!ff) ff = _.__proto__[met];
    if (typeof ff != "function") return;
    let n = ff.length;
    let s = "Enter ";
    if (n == 0) s += "optional arguments "; 
    if (n == 1) s += "the argument ";
    if (n >= 2) s += n+" arguments separated by commas ";
    let //arg = "("; while (--n > 0) arg += ", "; arg += ")";
    arg = prompt(s+"in order to call "+met+"()");
    if (arg != null) try {
        let cmd = "_."+met+"("+arg+")";
        report(cmd, eval(cmd));
    } catch(e) {
        reportError(e);
    }
}
function doProperty(c) { //target == list2
    if (c == 0 && _ instanceof Array) return;
    let obj = objP[c];
    if (obj === ITERABLE) 
         display(objToArray(_));
    else display(obj);
}
function doClick(evt, target) {
    let e = document.elementFromPoint(evt.clientX, evt.clientY);
    console.log(e.innerText);
    if (target == list3) {
        doMethod(e.innerText); return;
    }
    let p = e.parentNode;
    if (p !== target) e = p; //<li>
    console.assert(e.parentNode === target);
    let c = target.children.length;
    while (c--) if (target.children[c] === e) break;
    if (c < 0) return;
    if (target == list1) displayItem(c);
    else if (target == list2) doProperty(c);
    else reportError("Unknown "+target); 
}
function previous() {
    if (hist.length < 2) return;
    hist.pop(); display(hist.pop()); 
}
function remove() {
    if (objA.length < 2) return;
    objA.splice(current, 1);
    list1.removeChild(list1.children[current]);
    previous();
}
function doKey(evt) {
    //console.log(evt.key, current);
    switch (evt.key) {
      case "Delete":
        remove(); return;
      case "ArrowUp":
        evt.stopPropagation();
        displayItem(current-1); return;
      case "ArrowDown":
        evt.stopPropagation();
        displayItem(current+1); return;
      case "ArrowLeft": case "Backspace":
        previous(); return;
    }
}
function doEnter(evt) {
    if (evt.key == "Enter") try {
        evt.stopPropagation();
        let exp = inp.value;
        report(exp, eval(exp));
    } catch(e) {
        reportError(e);
    }
}
function trunc(s, M) { //if s is long, truncate to M chars
    if (s == null) s = "null";
    if (s.length > M+4) s = s.substring(0, M)+"...";
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
    const OBJ = "[object ", RB = "]";
    let list = "";
    for (let obj of a) {
        if (!obj) continue;
        let s = (L == list1? objToString(obj) : obj);
        s = trunc(s, MAX_CHARS);
        if (s[0] != '"' && s.includes(OBJ)) {
          s = s.replace(OBJ, "<B>");
          if (s.includes(RB))
            s = s.replace(RB, "</B>");
          else s = s+"</B>";
        }
        if (!s.startsWith("* *"))
            list += "<li>"+ s +"</li>";
        else { //class name
            list += "<li class=cname>" + s.substring(3);
            let sc = superClasses(_).join("<br>");
            list += "<span class=tip>"+ sc +"</span></li>";
        }
    }
    L.innerHTML = list;
}
function superClasses(obj) {
    let a = []
    while (obj = obj.__proto__) 
        a.push(obj.constructor.name)
    return a
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
    if (i < 0) objA.push(f); 
    arrayToList(objA, list1);
    displayItem(i); return f;
}
function displayItem(c) {
  function selectCurrent(dark) {
    let b = list1.children[current]; if (!b) return;
    b.style.color = (dark? "white" : "");
    b.style.backgroundColor = (dark? "blue" : "");
    //b.scrollIntoView();
  }
  function selectItem() {
    selectCurrent(false); current = c;
    if (c < 0) current = objA.length-1;
    if (c >= objA.length) current = 0;
    selectCurrent(true); 
  }
  function addProperty(key) {
    let obj = _[key];
    let s = key +": "+ objToString(obj);
    objP.push(obj); prop.push(s);
  }
  function addMethods(...metA) {
    for (let m of metA) meth.push(m); 
  }
  function add_proto_() {
    if (typeof _ == "string") {
        addProperty("length"); addMethods("charAt", "concat", "includes", 
        "indexOf", "repeat", "replace", "search", "split", "substring"); 
    } else if (_ instanceof Array) {
        addProperty("length"); addMethods("includes", "indexOf", 
        "join", "push", "pop", "reverse", "sort", "splice");
    } else if (_ instanceof Set) {
        addProperty("size");
        addMethods("add", "clear", "delete", "has", "values");
    } else if (_ instanceof Map) {
        addProperty("size");
        addMethods("delete", "entries", "get", "has", "keys", "set");
    } else if (_ instanceof RegExp) { 
        addProperty("flags"); addMethods("test", "exec");
    }
    /*else if (_ instanceof Error) { 
        addProperty("fileName"); addProperty("stack");
    }*/
  }
    //_ is global -- current object
    selectItem(); __ = _; _ = objA[current];
    objP.length = 1; let prop = [], meth = [];
    objP[0] = null; prop[0] = "* *"+_.constructor.name;
    if (_[Symbol.iterator]) {
        objP[0] = ITERABLE; prop[0] += " — Iterable";
    }
    add_proto_(); list1.focus();
    for (let key in _) {
      if (objP.length > MAX_PROP) break;
      try {
        if (key == "webkitStorageInfo") continue;
        let obj = _[key];
        if (typeof obj == "function") {
            meth.push(key);
        } else if (obj != null) {
            const LC = /[a-z0-9]/;
            //skip uppercase constants
            if (LC.test(key)) addProperty(key);
        }
      } catch(error) { //silently ignore
      }
    }
    arrayToList(prop, list2);
    arrayToList(meth, list3);
    let p = prop.length-1, m = meth.length;
    let s = p+" properties and "+m+" methods";
    out.innerText = trunc(_.toString(), 25)+" — "+s; 
    out.style.backgroundColor = "";
    let n = hist.length;
    if (hist[n-1] !== _) hist.push(_); 
    if (n > 50) hist.splice(0, 20);
}
function inspect(parent, init, command) {
    let t = document.createElement("table");
    parent.appendChild(t); t.innerHTML =
`
<tbody>
  <tr>
    <th><button onClick='previous()' 
      onMouseOver='makeVisible(prev, true)'
      onMouseOut ='makeVisible(prev, false)'>◀</button>
    <span id=prev>Display previous object</span>
    &nbsp; Objects &nbsp;
    <button onClick='remove()' 
      onMouseOver='makeVisible(dele, true)' 
      onMouseOut ='makeVisible(dele, false)'>✘</button>
    <span id=dele>Delete current object</span>
    </th>
    <th>Properties</th>
    <th>Methods</th>
  </tr>
  <tr>
    <td><ul id=list1 
        onClick='doClick(event, this)' 
        tabindex="0" onKeyDown='doKey(event)'>
    </ul></td>
    <td><ul id=list2 
        onClick='doClick(event, this)'>
    </ul></td>
    <td><ul id=list3 
        onClick='doClick(event, this)'>
    </ul></td>
  </tr>
  <tr>
    <td><input id=inp style="width:198px;" 
         onKeyUp='doEnter(event)'></td>
    <td id=out colSpan=2>output goes here</td>
  </tr>
</tbody>
`
    init(); inp.value = command;
    inp.selectionEnd = inp.value.length; 
    inp.selectionStart = 0; inp.focus();
}
