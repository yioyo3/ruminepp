Modules.registerModule("ReleaseChecker", function() {
	if (localStorage.getItem("lastChecked") === null || localStorage.getItem("lastChecked") + 600000 < Date.now()) {
		$.ajax({
			url: "https://api.github.com/repos/yioyo3/ruminepp/releases",
			success: function(result) {
				if (result[0].tag_name === RMPPVersion || result[0].tag_name === localStorage.getItem("lastVersion"))
					return;

				localStorage.setItem("lastVersion", result[0].tag_name);
				localStorage.setItem("lastChecked", Date.now());

				PageAPI.popup("Новая версия RuMine++", "Появилась новая версия RuMine++ <b>" + result[0].tag_name + "</b>", {
					"Подробнее": function() {
						window.location.href = "https://github.com/yioyo3/ruminepp/releases";
					}
				});
			}
		});
	}
});