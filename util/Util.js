"use strict";
/** Shows a hidden menu upon right-click on a given element
 *  
 * elt and menu must be defined in HTML code
 * items (if any) are added to those already in HTML
 * callback is invoked twice: when the menu is shown and when it is hidden
 * 
 * Based on code contributed by Abdurrahman Rajab - FSMVU
 * Ref: https://dev.to/iamafro/how-to-create-a-custom-context-menu--5d7p
*/
class ContextMenu {
    /**
     * @param {HTMLElement} elt -- right-click to show menu
     * @param {HTMLElement} menu 
     * @param {Array} items Array of string
     * @param {function} callback is invoked twice
     * @param {number} width of menu in px
     */
    constructor(elt, menu, items, callback, width=200) {
        this.elt = elt
        this.menu = menu
        this.items = items
        this.width = width
        menu.style.width = (width)+'px'
        const _S = '<span class="menuItem">', S_ = '</span>'
        menu.innerHTML += items.map(i => _S+i+S_).join('\n')
        menu.onclick = (evt) => {
            evt.preventDefault()
            this.selectItem(evt.target)
            this.hide(); callback(this)
        }
        elt.oncontextmenu = evt => this.process(evt, callback)
        document.onkeydown = (evt) => {
            if (evt.key == 'Escape') ContextMenu.hideAll()
        }
        document.onclick = (evt) => {
            evt.preventDefault(); ContextMenu.hideAll()
        }
    }
    /** Display menu at the position of the click or touch */
    show(evt) {
        this.showAt(evt.clientX, evt.clientY)
    }
    /** Display menu at (x, y) */
    showAt(x, y) {
        let cw = document.body.clientWidth
        x = Math.min(x, cw-this.width) // x+w<=cw
        this.menu.style.left = (x)+'px'
        this.menu.style.top  = (y)+'px'
        this.menu.hidden = false
    }
    /** is menu hidden? */
    get isHidden() { return this.menu.hidden }
    /** hide menu */
    hide() { this.menu.hidden = true }
    /** t becomes the current item */
    selectItem(t) { this.current = t }
    /**
     * Process left or right click
     * 
     * @param {HTMLElement} evt 
     * @param {function} callback if menu is shown
     */
    process(evt, callback) {
        if (this.isHidden) {
            this.show(evt); callback(this)
        } else this.hide()
        evt.stopPropagation(); evt.preventDefault()
    }
    /** Hide all menus in the document */
    static hideAll() {
        for (let e of document.querySelectorAll('.menu')) 
            e.hidden = true
    }
}

/** Shows a hidden menu upon click on elt
 * 
 *  Text of selected item is displayed in elt */
class SelectMenu extends ContextMenu {
    /**
     * @param {HTMLElement} elt -- selected item displayed here
     * @param {HTMLElement} menu 
     * @param {Array} items 
     * @param {function} callback 
     * @param {number} width of menu
     */
    constructor(elt, menu, items, callback, width) {
        super(elt, menu, items, callback, width)
        elt.style.width = (width)+'px'
        this.selectIndex(0)
        elt.oncontextmenu = '' //remove
        elt.onclick = evt => this.process(evt, callback)
    }
    /** Display menu just below elt -- event data not used */
    show(evt) {
        let e = this.elt
        let x = e.offsetLeft - 1
        let y = e.offsetTop + e.offsetHeight - 1
        while (e && e.scrollTop==0) e = e.parentElement
        if (e) y -= e.scrollTop
        this.showAt(x, y)
    }
    /** i becomes the current index */
    selectIndex(i) {
        const EM_SPACE = String.fromCharCode(8195)
        if (i<0 || i>=this.items.length) return
        this.index = i
        this.current = this.menu.children[i]
        this.elt.innerText = this.items[i]+EM_SPACE+'▾'
    }
    /** Find and select the item with text s */
    selectText(s) {
        this.selectIndex(this.items.indexOf(s))
    }
    /** Find and select the element t */
    selectItem(t) {
        let a = [...this.menu.children]
        this.selectIndex(a.indexOf(t))
    }
}
