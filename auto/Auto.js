"use strict";
class Sample {
    constructor(n, s1, s2, c) {
        this.name = n
        this.str1 = s1
        this.str2 = s2
        this.callback = c
    }
}

function markErr(i) {
    input.selectionStart = i
    input.selectionEnd = i+1
}

//DFA
function acceptD(w, F='C', q='A') {
    let i = 0, txt = q
    while (i < w.length) {
        q = deltaD(q, w[i])
        if (q == '') {
           markErr(i); break
        }
        i++; txt += " -> "+q
    }
    let a = (q!='' && F.includes(q))
    return txt+'\n'+(a? "Accept" : "Reject")
}
function testD() {
    let w = input.value, s = "  "
    for (let c of w) s += c+"    "
    s += '\n'+acceptD(w, final.value)
    console.log(s); out.innerHTML = s
}

//NFA
function union(a, b) { //set operation using strings
    let s = a
    for (let x of b) if (!a.includes(x)) s += x
    return s
}
function intersect(a, b) {
    let s = ''
    for (let x of b) if (a.includes(x)) s += x
    return s
}
function acceptN(w, F='c', Q='a') {
    let i = 0, txt = Q
    while (i < w.length) {
        let c = w[i], T=''
        for (let q of Q) 
            T = union(T, deltaN(q, c))
        Q = T
        if (Q == '') {
           markErr(i); break
        }
        i++; txt += ", "+c+" -> "+Q+'\n'+Q
    }
    let a = intersect(Q, F).length > 0
    return txt+'  '+(a? "Accept" : "Reject")
}
function testN() {
    let s = acceptN(input.value, final.value);
    console.log(s);  out.innerHTML = s
}

//RegExp
function setValues(arg) {
    let k = menu.selectedIndex
    //alert(arg+"   "+k)
    if (arg === true) {
      pat.value = pattern[k];
      input.value = words[k];
    }
    checkRE();
}
function checkRE() {
    if (pat.value && input.value) {
        let exp = new RegExp(pat.value,'g');
        let str = "<span class=found>$&</span>";
        out.innerHTML = input.value.replace(exp, str);
    }
}

//CFG
function generate(w, init='S') {
    let txt = init, g = init
    for (let i=0; i<w.length; i++) {
        let c = w[i], p = g[i]
        if (c == p) continue
        let d = deltaP(c, p)
        if (d == '') {
          markErr(i); break
        }
        g = g.replace(p, d)
        txt += "\n=> "+g
    }
    return txt+'\n'+(w==g ? "Accept" : "Reject")
}
function testG() {
    let s = generate(input.value);
    console.log(s); out.innerHTML = s
}

//PDA
function acceptP(w, init='S') {
    let txt = "push "+init
    let i = 0, m = w.length, S = [init]
    while (i < m && S.length > 0) {
        let c = w[i], p = S.pop()
        if (c == p) { //input matches stack  
            i++; txt += "\nmatch "+c
        } else { //find a valid transition
            let d = deltaP(c, p)
            if (d == '') {
              markErr(i); break
            }
            let A = d.split('').reverse()
            for (let x of A) S.push(x)
            txt += "\npush "+d
        }
        txt += " -> "
        for (let j=S.length-1; j>=0; j--) 
            txt += S[j]
    }
    let a = (i == m && S.length == 0)
    return txt+'  '+(a? "Accept" : "Reject")
}
function testP() {
    let s = acceptP(input.value);
    console.log(s); out.innerHTML = s
}

