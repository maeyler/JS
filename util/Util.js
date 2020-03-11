"use strict";
class ContextMenu {
    constructor(menu, items, callback, width=200) {
        this.menu = menu
        this.width = width
        const _S = '<span class="menuItem">', S_ = '</span>'
        menu.innerHTML += items.map(i => _S+i+S_).join('\n')
        menu.onclick = (evt) => {
          evt.preventDefault(); this.hide()
          let t = evt.target.innerText
          this.selectItem(t); callback(t)
        }
        menu.style.width = (width)+'px'
        document.onkeydown = (evt) => {
          if (evt.key == 'Escape') ContextMenu.hideAll()
        }
        // document.onclick = (evt) => {
        //   console.log(evt.target)
        //   if (evt.target !== menu) ContextMenu.hideAll()
        // }
    }
    show(evt) {
        this.showAt(evt.clientX, evt.clientY)
    }
    showAt(x, y) {
        let cw = document.body.clientWidth
        x = Math.min(x, cw-this.width) // x+w<=cw
        this.menu.style.left = (x)+'px'
        this.menu.style.top  = (y)+'px'
        this.menu.hidden = false
    }
    hide() { this.menu.hidden = true }
    selectItem(t) { /* override this behavior */}
    process(evt) {
        if (this.menu.hidden) 
             this.show(evt)
        else this.hide()
        evt.preventDefault()
    }
    static hideAll() {
        for (let e of document.querySelectorAll('.menu')) 
            e.hidden = true
    }
}
class SelectMenu extends ContextMenu {
    constructor(elt, menu, items, callback, width) {
        super(menu, items, callback, width)
        this.elt = elt
        this.items = items
        elt.style.width = (width)+'px'
        this.selectIndex(0)
    }
    show(evt) {
        let e = this.elt
        let x = e.offsetLeft
        let y = e.offsetTop + e.offsetHeight - 1
        while (e && e.scrollTop==0) e = e.parentElement
        if (e) y -= e.scrollTop
        this.showAt(x, y)
    }
    selectIndex(i) {
        if (i<0 || i>=this.items.length) return
        this.index = i
        this.elt.innerText = this.items[i]+' ⯆'
    }
    selectItem(t) {
        this.selectIndex(this.items.indexOf(t))
    }
}
