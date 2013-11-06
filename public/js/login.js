define(function(require, exports, module) {

	$(".main").onepage_scroll();

	var $loginBtn = $('#loginBtn'),
		$username = $('#username'),
		$password = $('#password'),
		$warning = $('#warning');

	$loginBtn.click(function() {
		var username = $username.val(),
			password = $password.val();
		if (!username) {
			$warning.html('<i class="icon attention"></i>请输入用户名').show();
			return;
		} else {
			if (!password) {
				$warning.html('<i class="icon attention"></i>请输入密码').show();
				return;
			}
		}

		$.ajax({
			url: '/api/login',
			type: 'POST',
			data: {
				username: username,
				password: password
			},
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				if (data.r === 0) { // 登录成功
					if (/signin/.test(window.location.href)) {
						window.location.href = '/';
					} else {
						window.location.reload();
					}
				} else { // 登录失败
					$warning.html('<i class="icon attention"></i>' + data.msg).show();
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {

			}
		});
	});


	$username.focus(function() {
		$warning.hide();
	});

	$password.focus(function() {
		$warning.hide();
	});


});