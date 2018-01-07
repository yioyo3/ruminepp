let DB = {
	_queue: [],
	init: function(cb) {
		DB._open = indexedDB.open("RuMinePP_DB", 1);
		
		DB._open.onsuccess = function() {
			DB.db = DB._open.result;
		}

		DB._open.onupgradeneeded = function() {
			DB.db = DB._open.result;

			let store = DB.db.createObjectStore("MessageHistory", { keyPath: "id", autoIncrement: true });
			store.createIndex("messageId", "messageId", { unique: false });
			store.createIndex("content", "content", { unique: false });
		}
	},
	processQueue: function() {
		let tx = DB.db.transaction("MessageHistory", "readwrite");
		let store = tx.objectStore("MessageHistory");

		let el = null;

		while (el = DB._queue.shift()) {
			store.put({
				messageId: el[0],
				content: el[1]
			});
		}
	},
	getMessageHistory: function(id, cb) {
		let result = [];

		DB.db
			.transaction("MessageHistory", "readonly")
			.objectStore("MessageHistory")
			.openCursor().onsuccess = function(event) {
				let cursor = event.target.result;

				if (cursor) {
					if (cursor.value.messageId === id)
						result.push(cursor.value.content);

					cursor.continue();
				} else {
					cb(result);
				}
			}
	},
	pushQueue(id, content) {
		DB._queue.push([id, content]);
	}
};