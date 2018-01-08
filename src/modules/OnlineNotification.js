Modules.registerModule("OnlineNotification", function() {
	if (!window.location.href.startsWith("https://ru-minecraft.ru/forum/")) return;

	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js");

	Notification.requestPermission();

	let current = PageAPI.getOnline();

	function tick() {
		$.ajax({
			success: function(body) {
				const actual = PageAPI.getOnline(body);

				const joined = _.difference(actual, current);

				joined.forEach(function(username) {
					PageAPI.getUserInfo(username, function(info) {
						let notification = new Notification(username + " онлайн", {
							icon: info.avatar
						});

						setTimeout(() => notification.close(), 2000);
					});
				});

				current = actual;
			}
		});
	}

	setInterval(() => tick(), 4000);
});