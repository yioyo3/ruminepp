Modules.registerModule("RuMinePP", function() {
	const container = $(".loginset")[1];
	let rmppSettings = document.createElement("a");

	rmppSettings.href = "#";
	rmppSettings.onclick = function() {
		PageAPI.popup("Настройки RuMine++", HTML.get("settings.html"), {
			"Применить": function() {
				Array.from($(".rmppSetting")).forEach(e => uCookies.setCookie(e.getAttribute("id") + "_enabled", e.checked ? "1" : "0"));
				localStorage.setItem("emoticons_urls", $("#CustomEmoticons_urls").val());
				window.location.reload();
			}
		});

		$("#CustomEmoticons_urls").val(localStorage.getItem("emoticons_urls") || "");
		$("#CustomEmoticons_urls").prop("disabled", uCookies.getCookie("CustomEmoticons_enabled") === "0");
		Array.from($(".rmppSetting")).forEach(e => e.checked = uCookies.getCookie(e.getAttribute("id") + "_enabled") !== "0");

		return false;
	}
	rmppSettings.innerHTML = "Настройки RuMine++";

	container.appendChild(rmppSettings);
});