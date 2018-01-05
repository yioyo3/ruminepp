const Modules = {
	_modules: [],
	registerModule: function(name, fn) {
		Modules._modules.push({ name: name, fn: fn });
	},
	load: function() {
		if (window.location.href.startsWith("https://ru-minecraft.ru/out?")) return;

		try {
			Notification.requestPermission();

			Modules._modules.forEach(function(m) {
				console.log(m.name + " enabled? " + (localStorage.getItem(m.name + "_enabled") !== "0"));
				if (localStorage.getItem(m.name + "_enabled") !== "0") m.fn();
			});
		} catch (e) {
			document.write("<pre><center><h1>Невозможно инициализировать RuMine++</h1></center><br><br>");
			document.write(e.stack + "");
			document.write("<br><br><i>" + navigator.userAgent + "</i></pre>");
		}
	}
};