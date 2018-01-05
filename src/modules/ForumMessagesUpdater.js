Modules.registerModule("ForumMessagesUpdater", function() {
	if (!PageAPI.isForumTopic()) return;

	let currentPage = null;
	let editing = null;

	function getNewMessages(cb) {
		$.ajax({
			success: function(content) {
				cb({
					messages: PageAPI.getForumMessages(content),
					page: PageAPI.getForumPage(content)
				});
			}
		});
	}

	function tick() {
		const current = PageAPI.getForumMessages();

		getNewMessages(function(actual) {
			if (current.length !== actual.messages.length) {
				actual.messages.slice(current.length).forEach(PageAPI.appendForumMessage);
			}

			current.forEach(function(c, i) {
				if (c.getAttribute("id").endsWith(editing)) return;

				if ($(".EditMsgView", $(c)).html() !== $(".EditMsgView", $(actual.messages[i])).html()) {
					$("#" + c.getAttribute("id")).html(actual.messages[i].innerHTML);
				}
			});

			if (currentPage !== null && currentPage !== actual.page) {
				currentPage = actual.page;

				PageAPI.popup("Опа!", "Появилась новая страница!", {
					"Перейти": function() {
						window.location.href = window.location.href.replace("page-" + (actual.page - 1), "page-" + actual.page);
					}
				});
			}

			if (currentPage === null) currentPage = actual.page;
		});
	}

	setInterval(() => tick(), 2000);

	// Inject
	window.MsgEdit = Injector.before(window.MsgEdit, (id) => editing = id);
	window.MsgEditSave = Injector.before(window.MsgEditSave, () => editing = null);
	window.MsgEditCancel = Injector.before(window.MsgEditCancel, () => editing = null);

	// Redefine default functions
	window.doAddMessage = function() {
	    var a = document.getElementById("message_add_form");
	    if (a.text_msg.value == "") {
	        Alert_popup(lang[0][29][6], lang[0][23][0]);
	        return false
	    }
	    if (a.recaptcha_response_field) {
	        var b = Recaptcha.get_response();
	        var c = Recaptcha.get_challenge()
	    } else if (a.question) {
	        var b = a.question.value;
	        var c = a.question_sec.value
	    } else {
	        var b = "";
	        var c = ""
	    }
	    Ajax_Loading("");
	    var d = new Array;
	    $("#message_add_form input[class='marker_file_ajax']").each(function(a, b) {
	        d.push($(b).val())
	    });
	    if (forum_cpu) {
	        var e = dle_root + forum_path + "/add/" + a.topict_id.value + "/post"
	    } else {
	        var e = dle_root + "index.php?do=" + forum_path + "&action=newpost&id=" + a.topict_id.value + "&param=post"
	    }
	    $.post(e, {
	        text_msg: a.text_msg.value,
	        topic_id: a.topict_id.value,
	        recaptcha_response_field: b,
	        recaptcha_challenge_field: c,
	        id_file: d
	    }, function(b) {
	        Ajax_close("");
	        if (b.param == 0) {
	            Alert_popup(b.data, lang[0][23][0]);
	            return false
	        } 
	        setElementForum()
	        $("#text_msg").val("");
	    }, "json");
	}
});