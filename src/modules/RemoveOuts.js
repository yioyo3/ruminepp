Modules.registerModule("RemoveOuts", function() {
	function base64Decode(str) {
	    return decodeURIComponent(atob(str).split("").map(function(c) {
	        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
	    }).join(""));
	}

	function tick() {
		$("a[href^='/out?']").each(function(i, e) {
			try {
				e.href = base64Decode(decodeURIComponent(e.href.slice(e.href.indexOf("?"))).slice(3));
			} catch(e) {}
		});
	}

	setInterval(() => tick(), 1000);
});