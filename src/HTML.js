let HTML = {
	_pages: {},
	register: function(name, content) {
		HTML._pages[name] = content;
	},
	get: function(name) {
		return decodeURIComponent(HTML._pages[name]);
	}
};