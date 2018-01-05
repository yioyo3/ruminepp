const PageAPI = {
	getForumMessages: function(content) {
		return Array.from($("li.msg", content ? $(content) : undefined)).slice(0, -1);
	},
	getForumPage: function(content) {
		return ~~$(".txt_info_pages", content ? $(content) : undefined)[1].innerHTML.split(" ").pop();
	},
	appendForumMessage: function(el) {
		$(".contentBoxTopicMessageList")[0].insertBefore(el, document.getElementById("addNewMsg"));
	},
	isForumTopic: function() {
		try {
			PageAPI.getForumPage();
		} catch(e) {
			return false;
		}

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
	insertCustomEmoticon: function(url) {
		doInsert("[img]" + url + "[/img]\n\n", "", false);
		$("#bullet_energy_emos").dialog("close");
		window.ie_range_cache = null;
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
	}
};