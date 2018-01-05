const HTMLPages = ["settings.html"];

function injectScript(content, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = content;
    node.appendChild(script);
}

function xhrGet(url, cb) {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            cb(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET", url, false);
    xmlhttp.send();    
}

function loadScript(path) {
	xhrGet(chrome.extension.getURL(path), (content) => injectScript(content, "body"));
}

loadScript("build/content.js");

let r = "";
HTMLPages.forEach(function(p) {
    xhrGet(chrome.extension.getURL("build/html/" + HTMLPages), function(content) {
        r += "HTML.register('" + p + "',\"" + encodeURIComponent(content) + "\");"; 
    });
});

injectScript("Modules.load();" + r, "body");