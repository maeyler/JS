"use strict";
const SPACE = '&emsp;', MAX = 40;
const SKIP = ['BR', 'SCRIPT', 'NAV'] //ignore tags
const CODE = `<style>
#output details {
  max-width: 300px;
  margin: 4px;
  margin-left: 1em;
  border: 3px solid green;
  border-radius: 8px;
}
#output li {
  list-style: none;
  margin: 0;
  margin-left: 1em;
  color: blue;
}
#output summary {
  cursor: pointer;
  color: white;
  background: green;
}
#output {
  color: green;
  line-height: 1.5;
}
</style>
<h2>DOM Tree</h2>
<input id=detail type="checkbox">
Use <code>&lt;details&gt;</code>
<p id=output></p>`
class DOMTree extends HTMLElement {
  constructor() {
    super();
    let sr = this.attachShadow({mode: 'open'})
    sr.innerHTML = CODE
    let root = this.getAttribute('root')
    if (!root) throw "root not found"
    this.main = document.querySelector('#'+root)
    if (!this.main) throw '#'+root+" not found"
    this.output = sr.querySelector('#output')
    this.detail = sr.querySelector('#detail')
    this.detail.onclick = this.render.bind(this)
    this.render()
  }
  render() {
    let main = this.main
    if (main.tagName === 'IFRAME')
      main = main.contentDocument.body
    let out = this.output
    if (this.detail.checked) {
      out.innerHTML = toDetails(main, 0)
      let da = out.querySelectorAll('details')
      for (let d of da) d.ontoggle = toggle
    } else {
      out.innerHTML = toTree(main, '')
    }
  }
}
customElements.define('dom-tree', DOMTree);

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
