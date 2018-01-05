Modules.registerModule("CustomEmoticons", function() {
	if (!PageAPI.isForumTopic()) return;

	const emoticons = localStorage.getItem("emoticons_urls").split("\n");

	window.ins_emo = Injector.after(window.ins_emo, function() {
		let container = $("#bullet_energy_emos > div > table > tbody")[0];
 
	    let text = document.createElement("tr");
	    text.innerHTML = "= Кастомные =";
	    let textend = document.createElement("tr");
	    textend.innerHTML = "= Основные =";
	 
	    container.insertBefore(text, container.firstChild);
	    container.insertBefore(textend, container.children[1]);
	 
	    let current = null;
	 
	    emoticons.forEach(function(e, i) {
	        if (i % 4 === 0) {
	            current = document.createElement("tr");
	            container.insertBefore(current, textend);
	        }
	 
	        let el_a = document.createElement("a");
	        let el = document.createElement("img");
	        let el_td = document.createElement("td");
	 
	        el.setAttribute("class", "emoji");
	        el.setAttribute("src", e);
	        el.setAttribute("width", "64px");
	        el_a.setAttribute("onclick", "PageAPI.insertCustomEmoticon('" + e + "'); return false;");
	        el_a.setAttribute("href", "#");
	        el_td.setAttribute("style", "padding:5px;");
	        el_td.setAttribute("align", "center");
	 
	        el_a.appendChild(el);
	        el_td.appendChild(el_a);
	        current.appendChild(el_td);
	    });
	});
});