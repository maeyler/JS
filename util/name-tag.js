//https://webcomponents.dev/edit/yQIUYQtgvxOUBM7l1Ajl/www/index.html
class NameTag extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "I'm "+this.getAttribute('name')
    // `<span>name: ${this.getAttribute('name')}</span>`;
  }
}
customElements.define('name-tag', NameTag);