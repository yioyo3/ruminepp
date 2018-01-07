Modules.registerModule("EditPreview", function() {
	window.ajax_prep_for_edit = Injector.after(window.ajax_prep_for_edit, function(id, mode) {
		if (mode !== "short") return;

		let button = document.createElement("button");
		let span = document.createElement("span");

		button.setAttribute("type", "button");
		button.setAttribute("class", "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
		button.setAttribute("role", "button");
		button.setAttribute("aria-disabled", "false");

		span.setAttribute("class", "ui-button-text");
		span.innerHTML = "Превью";

		button.appendChild(span);

		button.onclick = function() {
			const title = $("input[id^='edit-title-']")[0].value;
			const shortStory = $("textarea[id^='dleeditnews']")[0].value;
			const fullStory = $("textarea[id^='dleeditfullnews']")[0].value;

			PageAPI.openWithPost("/engine/preview.php", 
				{
					"catlist[]":"", 
					"title": title, 
					"xfield[name]": "", 
					"short_story": shortStory, 
					"full_story": fullStory, 
					"mod": "preview", 
					"approve": "1"
				}
			);
		}

		function tryAdd() {
			if (!$(".ui-dialog-buttonset")[0]) return setTimeout(() => tryAdd(), 500);
			$(".ui-dialog-buttonset")[0].appendChild(button)
		}

		tryAdd();
	});
});