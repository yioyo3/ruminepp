const Modules = {
	_modules: [],
	registerModule: function(name, fn) {
		Modules._modules.push({ name: name, fn: fn });
	},
	load: function() {
		Modules._modules.forEach(function(m) {
			console.log(m.name + " enabled? " + (uCookies.getCookie(m.name + "_enabled") !== "0"));
			if (uCookies.getCookie(m.name + "_enabled") !== "0") m.fn();
		});
	}
};