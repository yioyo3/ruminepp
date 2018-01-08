const PageAPI = {
	getForumMessages: function(content) {
		return Array.from($("li.msg", content ? $(content) : undefined)).slice(0, -1);
	},
	getForumPage: function(content) {
		try {
			return ~~$(".txt_info_pages", content ? $(content) : undefined)[1].innerHTML.split(" ").pop();
		} catch(e) {
			return 1;
		}
	},
	appendForumMessage: function(el) {
		$(".contentBoxTopicMessageList")[0].insertBefore(el, document.getElementById("addNewMsg"));
	},
	appendHistoryBtn: function(msg) {
		let el = document.createElement("a");

		el.href = "#";
		el.onclick = function() {
			editHistory(PageAPI.getMessageId(msg));
			return false;
		}
		el.innerHTML = "История редактирования";

		let msgEl = $(".msgIControl", $(msg))[0];

		if (!msgEl) return;

		msgEl.appendChild(el);
	},
	isForumTopic: function() {
		return window.location.href.startsWith("https://ru-minecraft.ru/forum/showtopic-");
	},
	getMessageInfo: function(msg) {
		const username = $(".autorInfo > p > a", $(msg))[0].innerHTML;
		const avatar = $(".avatar > a > img", $(msg))[0].src;
		const text = $("div[id^='MsgTextBox-']", $(msg))[0].innerText;

		return {
			username: username,
			avatar: avatar,
			text: text
		}
	},
	getMessageId: function(msg) {
		let topic = window.location.href.slice("https://ru-minecraft.ru/forum/showtopic-".length);
		topic = topic.slice(0, topic.indexOf("/"));
		const msgId = $(".getMessageLinck", $(msg)).text().slice(1);
		return topic + "_" + msgId;
	},
	getMessageHTML: function(msg) {
		let html = $("div[id^='MsgTextBox-']", $(msg)).html().trim();
		return html.slice(0, html.indexOf('<div class="likeBox-'));
	},
	insertCustomEmoticon: function(url) {
		doInsert("[img]" + url + "[/img]\n\n", "", false);
		$("#bullet_energy_emos").dialog("close");
		window.ie_range_cache = null;
	},
	getOnline: function(content) {
		return Array.from(
			$("span", 
				$(
					$(".userClin", content ? $(content) : undefined)[0]
				)
			).not("[style='color:#9CA1A5']")
		).map(e => e.innerText);
	},
	getUserInfo: function(username, cb) {
		// TODO: implement other

		$.ajax({ 
			url: "https://ru-minecraft.ru/engine/ajax/profile.php?name=" + username + "&skin=ru-minecraft", 
			success: function(content) {
				const e = $(content);

				const avatar = $("img", e)[0].src;

				cb({
					avatar: avatar
				});
			} 
		});
	},
	login: function(login, password, cb) {
		$.ajax({
			method: "POST",
			url: "https://ru-minecraft.ru/",
			data: {
				login_name: login,
				login_password: password,
				login: "submit"
			},
			success: function(body, status, xhr) {
				cb(true);
			},
			error: function() {
				cb(false);
			}
		});
	},
	popup: function (title, body, buttons) {
		$("#dlepopup").remove();
		$("body").append("<div id='dlepopup' title='" + title + "' style='display:none'>" + body + "</div>");
		$('#dlepopup').dialog({
			autoOpen: true,
			width: 550,
			dialogClass: "modalfixed",
			buttons: buttons
		});
	},
	openWithPost: function(url, data) {
		$("#Form").remove();

		let form = document.createElement("form");
		let target = "w" + Math.random();

		form.setAttribute("id", "Form");
		form.setAttribute("method", "POST");
		form.setAttribute("action", url);
		form.setAttribute("target", target);

		Object.keys(data).forEach(function(key) {
			let input = document.createElement("input");

			input.setAttribute("type", "hidden");
			input.setAttribute("name", key);
			input.setAttribute("value", data[key]);

			form.appendChild(input);
		});

		document.body.appendChild(form);

		window.open("", target, 'height=900,width=1250,resizable=0,scrollbars=1');
		form.submit();
	}
};