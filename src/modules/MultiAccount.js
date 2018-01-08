Modules.registerModule("MultiAccount", function() {
	$(".loginname").append(" <a href='#' style='color: #eee; font-size: 12px;' title='Мультиаккаунт' onclick='multiaccount(); return false;'>[+]</a>")

	if (!localStorage.getItem("accounts")) localStorage.setItem("accounts", "[]");

	function getAccounts() {
		return JSON.parse(localStorage.getItem("accounts"));
	}

	function addAccount(login, password) {
		let accounts = getAccounts();
		accounts.push({ login: login, password: password });
		localStorage.setItem("accounts", JSON.stringify(accounts));
	}

	function removeAccount(login) {
		let accounts = getAccounts();
		accounts = accounts.filter(e => e.login !== login);
		localStorage.setItem("accounts", JSON.stringify(accounts));
	}

	window.loginMultiaccount = function(login) {
		if (localStorage.getItem("_logout") !== "1") {
			localStorage.setItem("_logout", "do");
			localStorage.setItem("_queue_login", login);
			return window.location.href = "https://ru-minecraft.ru/index.php?action=logout";
		}

		localStorage.removeItem("_logout");

		document.write("Вхожу в аккаунт (2)...");

		const qlogin = localStorage.getItem("_queue_login");

		const password = getAccounts().find(e => e.login === qlogin).password;

		PageAPI.login(qlogin, password, function(success) {
			if (success) return setTimeout(() => window.location.reload(), 1000);

			PageAPI.popup("Ошибка", "Неверный логин или пароль");
		});

		return false;
	}

	window.deleteMultiaccount = function(login) {
		removeAccount(login);
		window.requestAnimationFrame(() => window.multiaccount());
		return false;
	}

	window.addMultiaccount = function() {
		let page = "<div style='display: block; vertical-align: middle; border-bottom: solid #ddd 2px;'>";
		page += "<img style='vertical-align: middle;' src='https://ru-minecraft.ru/templates/ru-minecraft/images/alert.png' />";
		page += "<span style='vertical-align: middle;'>Пароли хранятся локально без какого либо шифрования</span><br>";
		page += "</div><br>";

		// TODO move to html
		page += "<input style='width: 520px; border: none; outline: none; font-size: 16px;' type='text' id='ma-login' placeholder='Логин'><br><br>";
		page += "<input style='width: 520px; border: none; outline: none; font-size: 16px;' type='password' id='ma-password' placeholder='Пароль'>";

		PageAPI.popup("Добавить мультиаккаунт", page, {
			"Отмена": function() {
				window.requestAnimationFrame(() => window.multiaccount());
			},
			"Добавить": function() {
				const login = $("#ma-login").val();
				const password = $("#ma-password").val();

				addAccount(login, password);
				window.requestAnimationFrame(() => window.multiaccount());
			}
		});
	}

	window.multiaccount = function() {
		let page = "";

		getAccounts().forEach(function(account, i) {
			page += "<div style='display: block; vertical-align: middle; border-bottom: solid #ddd 2px; padding-bottom: 5px;'>";
			page += "<img style='vertical-align: middle;' src='' class='l-" + account.login + "' width='72px' />";
			page += "<span style='vertical-align: middle;'>";
			page += " <b>" + account.login + "</b>";
			page += " [ <a href='#' onclick=\"loginMultiaccount('" + account.login + "');\">Войти</a> | ";
			page += "<a href='#' onclick=\"deleteMultiaccount('" + account.login + "');\">Удалить</a> ]";
			page += "</span>";
			page += "</div><br>";

			PageAPI.getUserInfo(account.login, function(info) {
				$(".l-" + account.login).attr("src", info.avatar);
			});
		});

		PageAPI.popup("Мультиаккаунт", page || "<center>У вас нет аккаунтов.<br>Добавьте их, нажав кнопку <b>Добавить</b></center>", {
			"Закрыть": function() {
				$("#dlepopup").remove();
			},
			"Добавить": function() {
				window.addMultiaccount();
			}
		}, {
			"height": "320px"
		});
	}
});