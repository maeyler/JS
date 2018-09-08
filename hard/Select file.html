<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>Read local file </title>
</head>

<script>
"use strict";
const reader = new FileReader();
function isText(f) {
    console.assert(f instanceof File);
    return f.type.startsWith("text") || f.name.endsWith(".md")
         || f.name.endsWith(".js") || f.name.endsWith(".java");
}
function fileSelect(t) { //target is the button
    console.assert(t == button);
    const f = t.files[0];
    const size = " "+f.size+" bytes ";
    msg.innerText = f.type+size;
    if (f.type.startsWith("image")) {
        reader.onload = function(evt) {
            const a = evt.target.result; //image source
            out.innerHTML = "<img class=thumb "
                +"src='"+a+"' title='"+f.name+"' />";
            console.log(f.name+size+f.type);
        };
        reader.readAsDataURL(f);
    } else if (isText(f)) {
        reader.onload = function(evt) { //text
            const a = evt.target.result.replace(/</g, "&lt;");
            out.innerHTML = "<pre>"+a+"</pre>";
            console.log(f.name+size+f.type);
        };
        reader.readAsText(f);
    } else {
        msg.innerText += "Unknown ";
        out.innerText = "";
    }
}
</script>

<style>
  .thumb {
     width: 400px;
     border: 1px solid #000;
     margin: 10px 5px 0 0;
  }
</style>

<body>
<h2 id=title></h2>

<input type=file id=button onChange='fileSelect(this)' />
<p>
<output id=msg>Select text or image </output>
<output id=out></output>
</p>

<hr>
<b>Sample code</b>
<pre id=sample style="overflow-x:auto"></pre>
<hr>
<p>Ref: <a href="https://www.html5rocks.com/en/tutorials/file/dndfiles/" 
      target="ExternalDocument">File selection</a>
</p>

<script>
    title.innerText = document.title;
    sample.innerText = fileSelect.toString();
</script>

</body>
</html>
