"use strict";
const SPACE = '&emsp;', MAX = 40;
const SKIP = ['BR', 'SCRIPT'] //ignore tags
function textOf(e) {
  let s = e.tagName
  if (e.id) s += '#'+e.id
  if (e.className) s += '.'+e.className
  let c = e.firstChild
  if (c && !c.children)
    s += SPACE+c.textContent
  if (s.length > MAX+3)
    s = s.substring(0, MAX)+'…'
  return s
}
function toTree(e, space) {
  let tree = space+'+ '+textOf(e)+'<br>\n'
  for (let c of e.children) {
    if (SKIP.includes(c.tagName)) continue
    tree += toTree(c, space+SPACE)
  }
  return tree
}
function toDetails(e, lev) {
  let detail = ''
  let num = 0  //e.childElementCount
  for (let c of e.children) {
    if (SKIP.includes(c.tagName)) continue
    detail += toDetails(c, lev+1); num++ 
  }
  if (num === 0) //no children
    return '<li>'+textOf(e)+'</li>\n'
  let sum = e.tagName+SPACE+'[+'+num+']'
  return '<details id="'+textOf(e)+'"'
      +(num>10 && lev>0 ? '' : ' open')
      +'><summary>'+sum+'</summary>'
      +detail+'</details>\n'
}
function toggle(evt) {
    let d = evt.target   //details
    let s = d.firstChild //summary
    let t = s.innerText  //swap
    s.innerText = d.id
    d.id = t
}
function render() {
  let main = document.querySelector('#main.column')
  if (!main) throw "#main.column not found"
  if (main.tagName === 'IFRAME')
      main = main.contentDocument.body
  let out = document.querySelector('p#output')
  if (!out) throw "p#output not found"
  let det = document.querySelector('input#detail')
  if (det && det.checked) {
    out.innerHTML = toDetails(main, 0)
    let da = out.querySelectorAll('details')
    for (let d of da) d.ontoggle = toggle
  } else {
    out.innerHTML = toTree(main, '')
  }
}
function init() {
  let tree = document.querySelector('#tree.column')
  if (!tree) throw "#tree.column not found"
  let h = tree.innerHTML || '<h2>DOM Tree</h2>'
  tree.innerHTML = h+
  `<input id=detail type="checkbox" onchange="render()">
  Use <code>&lt;details&gt;</code> <p id=output></p>`
  render()
}
// window.onload = init
init()
