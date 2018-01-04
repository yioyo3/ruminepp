$.ajaxSetup({ cache: false });
Notification.requestPermission();

var cpage = null;
var editing = false;

function popup(title, body, buttons) {
	$("#dlepopup").remove();
	$("body").append("<div id='dlepopup' title='" + title + "' style='display:none'>" + body + "</div>");
	$('#dlepopup').dialog({
		autoOpen:true,
		width:550,
		dialogClass:"modalfixed",
		buttons: buttons
	});
}

function getCurrentComments() {
	return $("li.msg");
}

function getNewComments(callback, lolKostil) {
	$.ajax({
		success: function(body) {
			callback($("li.msg", $(body)));
			lolKostil($(".txt_info_pages", $(body))[1].innerHTML);
		}
	});
}

function updateComments() {
	if (window.location.href.indexOf("forum/showtopic-") === -1) return;

	var old = getCurrentComments();
	var container = $(".contentBoxTopicMessageList")[0];

	getNewComments(function(comments) {
		if (comments.length !== old.length) {
			for (var i = 0; i < comments.length - old.length; i++) {
				var c = comments[comments.length - 2 - i];

				if (Notification.permission === "granted") {
					var user = c.children[0].children[0].children[2].children[0].innerText;
					new Notification(user, {
						body: c.children[1].innerText,
						icon: c.children[0].children[0].children[0].children[0].children[0].src
					});
				}

				container.insertBefore(c, document.getElementById("addNewMsg"));
			}
		} else {
			if (editing) return;

			for (var i = 0; i < old.length - 1; i++) {
				if ($(".EditMsgView", old[i]).html() !== $(".EditMsgView", comments[i]).html()) {
					old[i].children[1].innerHTML = comments[i].children[1].innerHTML;i
				}
			}
		}
	}, function(p) {
		if (editing) return;

		var newpage = ~~p.split(" ").pop();

		console.log(p, cpage);

		if (cpage && cpage !== newpage) {
			cpage = newpage;

			popup("Опа!", "Появилась новая страница!", {
				"Перейти": function() {
					window.location.href = window.location.href.replace("page-" + (newpage - 1), "page-" + newpage);
				}
			});
		}

		if (!cpage) cpage = newpage;
	});
}

setInterval(() => updateComments(), 2000);

function doAddMessage() {
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
    }, "json")
}

if (typeof window.MsgEdit !== "undefined") {
	_MsgEdit = window.MsgEdit;
	window.MsgEdit = function() {
		editing = true;
		return _MsgEdit.apply(this, arguments);
	}
	_MsgEditSave = window.MsgEditSave;
	window.MsgEditSave = function() {
		editing = false;
		return _MsgEditSave.apply(this, arguments);
	}
	_MsgEditCancel = window.MsgEditCancel;
	window.MsgEditCancel = function() {
		editing = false;
		return _MsgEditCancel.apply(this, arguments);
	}
}

function popupRMPP() {
	popup("Настройки RuMine++", [
		"<b>Самый тестовый образец в мире</b>"
	].join("<br>"), {
		"Сохранить": function() {
			window.location.reload();
		}
	});
}

$(".loginin").append('<br><a href="#" onclick="popupRMPP(); return false;" class="loginadnews">RuMine++</a><br><br>');