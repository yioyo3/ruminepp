const Injector = {
	before: function(fn, inj) {
		let self = this;

		return function() {
			inj.apply(self, arguments);
			return fn.apply(self, arguments);
		}
	},
	after: function(fn, inj) {
		let self = this;

		return function() {
			const res = fn.apply(self, arguments);
			inj.apply(self, arguments);
			return res;
		}
	}
};