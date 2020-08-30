"use strict";
const VERSION = "V2.15", ITERABLE = new Object();
const MAX_CHARS = 28, MAX_PROP = 1000;
const objA = [], objP = [], NL = "\n";
const hist = [];    //object history -- global variable
var current = 0;  //current object index in list1 & objA
var _  = "";  //current object
var __ = "";  //previous object
var MENU;  //installed by the caller
class Menu {
  constructor() {}
  allKeysIn(obj) {
  //let s = []; for (let k in obj) s.push(k); 
    return Object.getOwnPropertyNames(obj)
  }
  allValuesOf(obj) {
    return this.allKeysIn(obj).map(k => obj[k])
        .filter(x => typeof x != 'function')
  }
  deepEqual(a, b) { //compare two objects
    return JSON.stringify(a) == JSON.stringify(b)
  }
  toString() { 
    return "[object Menu] " +this.constructor.name 
  }
}
function report(input, result) { 
    let msg = trunc(input, MAX_CHARS);
    if (result != undefined) {
        display(result);
        msg += trunc(" ⇒ "+result, 2*MAX_CHARS); 
    }
    console.log(msg); out.innerText = msg; 
    out.style.background = "";
}
function reportError(e) {
    console.log(e); 
    out.innerText = trunc(" "+e, 4*MAX_CHARS); 
    out.style.background = "pink";
}
function doMethod(met) { //target == list3
    //n, s may interfere with local vars with the same name
    let _n_ = _[met].length; //number of arguments in met
    let _s_ = "Enter ";
    if (_n_ == 0) _s_ += "optional arguments "; 
    if (_n_ == 1) _s_ += "the argument ";
    if (_n_ >= 2) _s_ += _n_+" arguments separated by commas ";
    let arg = prompt(_s_+"in order to call "+met+"()");
    if (arg != null) try {
        let cmd = "_."+met+"("+arg+")";
        report(cmd, eval(cmd));
    } catch(e) {
        reportError(e);
    }
}
function doProperty(c) { //target == list2
    if (c == 0 && _ instanceof Array) return;
    if (objP[c] === ITERABLE) 
         display([..._]); //convert _ to Array
    else display(objP[c]);
}
function doClick(evt, target) {
    let e = evt.target;
    //document.elementFromPoint(evt.clientX, evt.clientY);
    //console.log(e.innerText);
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
function removeIt(ctrl) {
    if (objA.length < 2) return;
    if (ctrl) {
        objA.length = 1; displayItem(0);
    } else {
        objA.splice(current, 1);
        //list1.removeChild(list1.children[current]);
        previous();
    }
}
function doKey(evt) {
    //console.log(evt.key, current);
    switch (evt.key) {
      case "Delete":
        removeIt(evt.ctrlKey); return;
      case "ArrowUp":
        evt.preventDefault()  //evt.stopPropagation();
        displayItem(current-1); return;
      case "ArrowDown":
        evt.preventDefault()  //evt.stopPropagation();
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

Request.prototype.toString = function() {
    let s = this.url; let k = s.indexOf('/',8); 
    return "[R] "+s.substring(k+1)
}
// 'this' is undefined in ()=>"File: "+this.name;
File.prototype.toString = function() {
    return "[F] "+this.name
}
function checkFile(f) { //not used
    if (Reflect.ownKeys(f).includes("toString")) return;
    f.toString = () => "File: "+f.name;
    //console.log("toString returns "+f);
}
function objToString(obj) {
    const LT = /</g;
    //if (obj instanceof File) checkFile(obj);
    let s = obj.toString().replace(LT, "&lt;");
    if (typeof obj == "string") s = '"'+s+'"';
    else if (obj instanceof Array) s = '['+s+']';
    //else if (obj instanceof Set) s = '{'+[...obj]+'}';
    return s;
}
function arrayToList(a, L) {
    const OBJ = "[object ", RB = "]";
    let list = "";
    for (let j=0; j<a.length; j++) {
        let obj = a[j];
        if (obj === "") obj = " ";
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
            let cls = (j>0? "cname" : "cfirst")
            list += "<li class="+cls+">" + s.substring(3);
            if (j > 0) continue; //show tip for the first item
            let sc = superClasses(_).join("<br>");
            list += "<span class=tip2>"+ sc +"</span></li>";
        }
    }
    L.innerHTML = list;
}
function superClasses(obj) {
    let a = [];
    while (obj = Object.getPrototypeOf(obj)) 
        a.push(obj.constructor.name);
    return a;
}
function display(f) {
    if (!f) return; let t = typeof f;
    if (t != "string" && t != "object") return;
  //if (f instanceof Promise) nothing to display in f
    if (f.then && typeof(f.then) == "function") {
        f.then(display, reportError); console.log(f);
        out.innerText = "A Promise was made";
        out.style.background = "cyan"; return;
    }
    let i = objA.indexOf(f);
    if (i < 0) objA.push(f); 
    displayItem(i); return f;
}
function displayItem(c) {
  const DEPRECATED = ["anchor", "big", "blink", "bold", "fixed", "fontcolor", 
    "fontsize", "italics", "link", "small", "strike", "sub", "substr", "sup"];
  function selectCurrent(dark) {
    let b = list1.children[current]; if (!b) return;
    b.style.color = (dark? "white" : "");
    b.style.background = (dark? "blue" : "");
    //b.scrollIntoView();
  }
  function selectItem() {
    selectCurrent(false); current = c;
    if (c < 0) current = objA.length-1;
    if (c >= objA.length) current = 0;
    selectCurrent(true); 
  }
  function addMethod(m, key) {
    if (meth.includes(key)) return;
    m.push(key); numM++;
  }
  function addProperty(key) {
    let obj = _[key];
    let s = key +": "+ objToString(obj);
    objP.push(obj); prop.push(s); numP++;
  }
  function process(proto) {
  //http://stackoverflow.com/a/8024294/271577
    if (proto != Object.getPrototypeOf(_)) try {
      let aaP = null, aaS = "* *"+proto.constructor.name;
      meth.push(aaS);
      if (proto == _ && proto[Symbol.iterator]) {
          aaP = ITERABLE; aaS += " — Iterable";
      }
      objP.push(aaP); prop.push(aaS);
      let len = proto["length"]; //may throw TypeError
      if (len && typeof len != "function" && proto == _) 
          addProperty("length");
    } catch(error) { //silently ignore
    }
    if (Object.getPrototypeOf(proto) == null) 
        return; //Object keys are not listed
    let K = Object.getOwnPropertyNames(proto);
    if (K.length > MAX_PROP) K.length = MAX_PROP;
    let mmm = [];
    for (let key of K) {
      if (key.startsWith("webkit")) continue;
      try {
        let obj = _[key]; //may throw TypeError
        const LC = /[a-z0-9]/;
        if (typeof obj == "function") {
            if (key == "constructor") continue;
            if (!LC.test(key[0])) continue;
            addMethod(mmm, key);
        } else if (obj != null) {
            if (key == "length") continue;
            //skip uppercase constants
            if (proto == _ || LC.test(key))
                addProperty(key);
        }
      } catch(error) { //silently ignore
      }
    }
    //we cannot sort properties, Array keys are string
    if (mmm.length == 0) return;
    if (sorted.checked) mmm.sort();
    meth = meth.concat(mmm);
  }
  //_ is global -- current object
    arrayToList(objA, list1);
    selectItem(); __ = _; _ = objA[current];
    objP.length = 0; //clear
    let prop = [], meth = [], numP = 0, numM = 0;
    list1.focus(); let proto = _;
    do { process(proto);
      proto = Object.getPrototypeOf(proto);
    } while (proto);
    arrayToList(prop, list2);
    addMethod(meth, "toString");
    if (typeof _ == "string") { //remove DEPRECATED items
        meth = meth.filter(m => !DEPRECATED.includes(m));
        numM = meth.length - 2;
    }
    arrayToList(meth, list3);
    let s = numP+" properties and "+numM+" methods";
    out.innerText = trunc(_.toString(), 25)+" — "+s; 
    out.style.background = "";
    let n = hist.length;
    if (hist[n-1] !== _) hist.push(_); 
    if (n > 50) hist.splice(0, 20);
}
function hideTip(t, show) {
    //let v = show? 'visible' : 'hidden'
    for (let x of t.querySelectorAll(".tip1")) 
      x.hidden = !show
}
function inspect(parent, init) {
    let t = document.createElement("table");
    t.className = 'inspector';
    parent.appendChild(t); t.innerHTML =
`
  <tr>
    <th><button onClick='previous();hideTip(this)'>◀
    <span class=tip1>Display previous object</span></button>
    &nbsp; Objects &nbsp;
    <button onClick='removeIt(event.ctrlKey);hideTip(this)'>✘
    <span class=tip1>Delete current object<br>
        (&lt;CTRL&gt; deletes all)</span></button>
    </th>
    <th><button id=menu onClick='display(MENU);hideTip(this)'>M
    <span class=tip1>Display Menu</span></button>
    &nbsp; Properties
    </th>
  </tr>
  <tr>
    <td rowSpan=3><ul id=list1 
        onClick='doClick(event, this)' 
        tabindex="0" onKeyDown='doKey(event)'>
    </ul></td>
    <td><ul id=list2 
        onClick='doClick(event, this)'>
    </ul></td>
  </tr>
  <tr>
    <th>Methods
    <input id=sorted type=checkbox checked=true onClick="display(_)">
    <span id=small>sort</span>
    </th>
  </tr>
  <tr>
    <td><ul id=list3 
        onClick='doClick(event, this)'>
    </ul></td>
  </tr>
  <tr>
    <td colSpan=2><input id=inp onKeyUp='doEnter(event)'>
    </td>
  </tr>
  <tr>
    <td colSpan=2 id=out></td>
  </tr>
`
    if (init) init(); 
    if (!MENU) menu.style.visibility="hidden";
    inp.selectionEnd = inp.value.length; 
    inp.selectionStart = 0; inp.focus();
    if (window.sss) for (let x of sss.querySelectorAll("button")) {
       x.onmouseover = (e) => { hideTip(x, true) }
       x.onmouseout  = (e) => { hideTip(x, false) }
    }
}
