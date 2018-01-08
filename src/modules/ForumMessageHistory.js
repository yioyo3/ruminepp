Modules.registerModule("ForumMessageHistory", function() {
	if (!PageAPI.isForumTopic()) return;

	DB.init();

	// временный костыль
	window._pushHistory = function(msg) {
		if (!DB.db) return setTimeout(() => window._pushHistory(msg), 1000);

		const text = PageAPI.getMessageHTML(msg);
		const id = PageAPI.getMessageId(msg);

		DB.getMessageHistory(id, function(history) {
			if (history[history.length - 1] === text) return;

			DB.pushQueue(id, PageAPI.getMessageHTML(msg));
		});
	}

	PageAPI.appendForumMessage = Injector.before(PageAPI.appendForumMessage, function(msg) {
		window._pushHistory(msg);

		PageAPI.appendHistoryBtn(msg);
	});

	PageAPI.getForumMessages().forEach(function(msg) {
		window._pushHistory(msg);

		PageAPI.appendHistoryBtn(msg);
	});

	window.editHistory = function(id) {
		ShowLoading();

		DB.getMessageHistory(id, function(history) {
			HideLoading();

			history.unshift("");

			PageAPI.popup(
				"История редактирования", 
				history.join("<hr>"),
				{
					"Ясно": function() {
						$("#dlepopup").remove();
					}
				}
			);
		});
	}

	function tryQueue() {
		if (DB.db) DB.processQueue();
		
		setTimeout(() => tryQueue(), 1000);
	}

	tryQueue();
});