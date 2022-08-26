"use strict";
const NAV = 
`<link href="/JS/navbar.css" rel="stylesheet">
<style>
    nav a {background: wheat}
</style> 
<ul>
    <li class=Simple>Simple
      <div class=nav_menu>
        <a href="/JS/simple/Date%20test.html">Date and Color</a>
        <a href="/JS/simple/char_count.html">Char Count</a>
        <a href="/JS/simple/Color%20Paragraphs.html">Color Paragraphs</a>
        <a href="/JS/simple/Compare%20Colors.html">Compare Colors</a>
        <a href="/JS/simple/HTML%20items.html">HTML Items</a>
        <a href="/JS/simple/Calculator.html">Calculator</a>
        <a href="/JS/simple/Counter.html">Click Count</a>
        <!--a href="/JS/simple/Clock.html">Clock</a-->
        <a href="/JS/simple/Timer.html">Simple Timer</a>
        <a href="/JS/simple/JS_Animation.html">JS Animation</a>
        <a href="/JS/simple/CSS_Transition.html">CSS Transition</a>
        <a href="/JS/simple/ArrayAndSet.html">Array & Set Demo</a>
        <a href="/JS/simple/carousel.html">Image Carousel</a>
        <a href="/JS/simple/JSON_Teacher.html">JSON Teacher</a>
      </div>
    </li>
    <li class=Math>Math
      <div class=nav_menu>
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
      </div>
    </li>
    <li class=Hard>Hard
      <div class=nav_menu>
        <a href="/JS/hard/JS%20page.html">Page made by JS</a>
        <a href="/JS/hard/Table%20maker.html">Table Maker</a>
        <a href="/JS/hard/Select%20file.html">Select Local</a>
        <a href="/JS/api/directory.html">Select directory</a>
        <a href="/JS/hard/Fetch%20remote.html">Fetch Remote</a>
        <a href="/JS/data/Students.html">Student Database</a>
        <a href="/JS/hard/ObjectList.html">List of Objects</a>
        <a href="/JS/linear/Equation.html">Linear Equations</a>
        <a href="/JS/auto/Auto.html">Automata</a>
        <a href="/JS/auto/Expression.html">Expression tree</a>
        <a href="/JS/hard/JSON_Hilite.html">JSON Highlight</a>
        <a href="/JS/hard/Philosophers.html">Dining Philosophers</a>
        <a href="/JS/sss/inspector.html">Inspector</a>
      </div>
    </li>
    <li class=Events>Events
      <div class=nav_menu>
        <a href="/JS/hard/Events.html">Event Handlers</a>
        <a href="/JS/hard/Battery.html">Battery & Internet</a>
        <a href="/JS/hard/Propagation.html">Event Propagation</a>
        <a href="/JS/hard/Dragging.html">Draggable Elements</a>
        <a href="/JS/hard/URL_parts.html">URL Parts</a>
        <a href="/JS/util/Menu_items.html">Menu</a>
        <a href="/JS/util/Modal_dialog.html">Modal dialog</a>
        <a href="/JS/util/Details.html">Details-Summary</a>
        <a href="/JS/util/name-tag.html">Web Components</a>
        <a href="/JS/hard/DOM%20tree.html">DOM tree</a>
      </div>
    </li>
    <li class=External>External
      <div class=nav_menu>
        <a href="/JS/api/qrcode.html">QR Code</a>
        <a href="/JS/api/GitHub_Users.html">GitHub Users</a>
        <a href="/JS/api/Location.html">Location</a>
        <a href="/JS/api/Weather.html">OpenWeather</a>
        <a href="/JS/canvas/googlemaps.html">Maps 1</a>
        <a href="/JS/canvas/mapboxgl.html">Maps 2</a>
        <a href="/JS/canvas/ibb_map.html">Maps 3</a>
        <a href="/JS/api/YouTube.html">YouTube play list</a>
        <a href="/JS/api/YT_teacher.html">YouTube teacher</a>
        <a href="/JS/api/Drive_API.html">Google Drive</a>
        <a href="/JS/api/Drive_teacher.html">Drive teacher</a>
      </div>
    </li>
</ul>`

function setNavbar() {
  let nav = document.createElement('nav')
  nav.innerHTML = NAV
  document.body.append(nav)
  nav.querySelectorAll("li").forEach(li => {
    let div = li.firstElementChild
    li.onmouseenter = () => {
      div.style.display = 'block'
      let w = div.offsetWidth - li.offsetWidth
      let x = li.offsetLeft - w/2
      let m = nav.offsetWidth - div.offsetWidth
      div.style.left = Math.min(Math.max(0, x), m)+'px'
    }
    li.onmouseleave = () => { div.style.display = '' }
  })
}
setNavbar()
