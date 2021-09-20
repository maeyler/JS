"use strict";
const CSS =
`body {
  margin-top: 48px;
}
nav {
  position: fixed;
  top: 0;
  margin-left: -8px;
  font-family: sans-serif;
}
nav ul {
  margin: 0;
  padding: 0;
}
nav .main {
  white-space: nowrap;
  background: yellow;
  color: blue;
}
nav .main > li {
  display: inline-block;
  padding: 12px;
  margin: 0;
}
nav .menu {
  position: absolute;
  top: 32px;
  display: inline-block;
  list-style-type: none;
  display: none;
}
nav a:last-child {
  border-bottom: none;
}
nav a {
  display: block;
  text-decoration: none;
  background: wheat;
  color: black;
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px dotted gray;
}
nav li:hover, nav a:hover {
  background: blue;
  color: yellow;
}`

const NAV = 
`<ul class=main>
  <li id=simple>Simple
    <ul class="menu simple">
      <a href="/JS/simple/Date%20test.html">Date and Color</a>
      <a href="/JS/simple/char_count.html">Char Count</a>
      <a href="/JS/simple/Color%20Paragraphs.html">Color Paragraphs</a>
      <a href="/JS/simple/Compare%20Colors.html">Compare Colors</a>
      <a href="/JS/simple/HTML%20items.html">HTML Items</a>
      <a href="/JS/simple/Calculator.html">Calculator</a>
      <a href="/JS/simple/Counter.html">Click Count</a>
      <a href="/JS/simple/Clock.html">Clock</a>
      <a href="/JS/simple/Timer.html">Simple Timer</a>
      <a href="/JS/simple/JS_Animation.html">JS Animation</a>
      <a href="/JS/simple/ArrayAndSet.html">Array & Set Demo</a>
      <a href="/JS/simple/carousel.html">Image Carousel</a>
      <a href="/JS/simple/JSON_Teacher.html">JSON Teacher</a>
    </ul>
  </li >
  <li id=math>Math
    <ul class="menu math">
      <a href="/JS/math/Counting.html">Counting</a>
      <a href="/JS/math/Math%20functions.html">Math Functions</a>
      <a href="/JS/math/Numbers.html">Numbers</a>
      <a href="/JS/math/Base%20Conversion.html">Base Conversion</a>
      <a href="/JS/math/Primes.html">Primes</a>
      <a href="/JS/math/TCKimlik.html">TC Kimlik</a>
      <a href="/JS/math/Folding.html">Pythagorean Triples</a>
      <a href="/JS/canvas/Graphics.html">Graphics</a>
      <a href="/JS/canvas/Pie%20Chart.html">Pie Chart</a>
      <a href="/JS/canvas/webcam.html">Camera</a>
      <a href="/JS/canvas/colliding.html">Colliding balls</a>
      <a href="/JS/canvas/sunflower.html">Sunflower</a>
      <a href="/JS/canvas/solar_system.html">Solar System</a>
    </ul>
  </li >
  <li id=hard>Hard
    <ul class="menu hard">
      <a href="/JS/hard/JS%20page.html">Page made by JS</a>
      <a href="/JS/hard/Table%20maker.html">Table Maker</a>
      <a href="/JS/hard/Select%20file.html">Select Local</a>
      <a href="/JS/hard/Fetch%20remote.html">Fetch Remote</a>
      <a href="/JS/data/Students.html">Student Database</a>
      <a href="/JS/hard/ObjectList.html">List of Objects</a>
      <a href="/JS/hard/Console.html">Console</a>
      <a href="/JS/auto/Auto.html">Automata</a>
      <a href="/JS/auto/Expression.html">Expression tree</a>
      <a href="/JS/hard/JSON_Hilite.html">JSON Highlight</a>
      <a href="/JS/hard/Philosophers.html">Dining Philosophers</a>
      <a href="/JS/sss/inspector.html">Inspector</a>
    </ul>
  </li >
  <li id=events>Events
    <ul class="menu events">
      <a href="/JS/hard/Events.html">Event Handlers</a>
      <a href="/JS/hard/Battery.html">Battery & Internet</a>
      <a href="/JS/hard/Propagation.html">Event Propagation</a>
      <a href="/JS/hard/Dragging.html">Draggable Elements</a>
      <a href="/JS/hard/URL_parts.html">URL Parts</a>
      <a href="/JS/util/Menu_items.html">Menu</a>
      <a href="/JS/util/Modal_dialog.html">Modal dialog</a>
      <a href="/JS/util/Details.html">Details-Summary</a>
      <a href="/JS/util/name-tag.html">Web Components</a>
    </ul>
  </li >
  <li id=external>External
    <ul class="menu external">
      <a href="/JS/api/GitHub_Users.html">GitHub Users</a>
      <a href="/JS/api/Location.html">Location</a>
      <a href="/JS/api/Countries.html">Countries</a>
      <a href="/JS/api/Weather.html">OpenWeather</a>
      <a href="/JS/canvas/googlemaps.html">Maps 1</a>
      <a href="/JS/canvas/mapboxgl.html">Maps 2</a>
      <a href="/JS/canvas/ibb_map.html">Maps 3</a>
      <a href="/JS/api/YouTube.html">YouTube play list</a>
      <a href="/JS/api/YT_teacher.html">YouTube teacher</a>
      <a href="/JS/api/Drive_API.html">Google Drive</a>
      <a href="/JS/api/Drive_teacher.html">Drive teacher</a>
    </ul>
  </li >
</ul>`

function setNavbar() {
  let css = document.createElement('style')
  css.innerHTML = CSS
  document.head.append(css)
  let nav = document.createElement('nav')
  nav.innerHTML = NAV
  document.body.append(nav)
  let w = nav.offsetWidth
  nav.querySelectorAll("li[id]").forEach(li => {
    let ul = li.querySelector("ul."+li.id)
    //   console.log(li.id, ul)
    li.onmouseenter = () => {
        ul.style.display = 'block';
        ul.style.left = 
          Math.min(li.offsetLeft, w-ul.offsetWidth)+'px'
    }
    li.onmouseleave = () => { ul.style.display = '' }
  })
}
setNavbar()
