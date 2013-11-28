define(function(require, exports, module) {

	require('../lib/jquery.base64.min.js');

	// page1 登录
	// -------------------------------------------
	var $signinBtn = $('.signin.button'),
		$username = $('.page1 .username'),
		$password = $('.page1 .password'),
		$warning = $('.page1 .warning');

	$signinBtn.click(function() {
		var username = $username.val().trim(),
			password = $password.val().trim();
		// TODO
		// 测试模式
		username = "wanggan";
		password = "123456";

		if(!username) {
			$warning.html('<i class="icon attention"></i>请输入用户名').show();
			return;
		}

		if(!password) {
			$warning.html('<i class="icon attention"></i>请输入密码').show();
			return;
		}

		password = $.base64.encode(password);

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
					if (/index/.test(window.location.href)) {
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

	// TODO
	// 与page2注册按钮会冲突，以后删除
	$('body').keydown(function(e) {
		if(e.keyCode === 13) {
			$signinBtn.click();
		}
	});

	// page2 注册
	// -------------------------------------------
	$('.labeled.signup.button').click(function() {
		$('.page2 .form').fadeIn();
	});

	var $signup = $('.page2 .submit.signup.button'),
		$newUsername = $('.page2 .username'),
		$newPassword = $('.page2 .password'),
		$rePassword = $('.page2 .rePassword'),
		$newEmail = $('.page2 .email'),
		$newWarning = $('.page2 .warning');

	// 注册表单点击“注册”按钮
	$signup.click(function() {
		var username = $newUsername.val().trim(),
			password = $newPassword.val().trim(),
			rePassword = $rePassword.val().trim(),
			email = $newEmail.val().trim();

		if (!username) {
			$newWarning.html('<i class="icon attention"></i>请输入用户名').show();
			return;
		}

		if(!password) {
			$newWarning.html('<i class="icon attention"></i>请输入密码').show();
			return;
		}

		if(!rePassword) {
			$newWarning.html('<i class="icon attention"></i>请输入确认密码').show();
			return;
		}

		if(!email) {
			$newWarning.html('<i class="icon attention"></i>请输入电子邮箱').show();
			return;
		}

		if(password !== rePassword) {
			$newWarning.html('<i class="icon attention"></i>两次输入的密码不一致').show();
			$newPassword.val('');
			$rePassword.val('');
			return;
		}

		$.ajax({
			url: '/api/signup',
			type: 'POST',
			data: {
				username: username,
				password: $.base64.encode(password),
				rePassword: $.base64.encode(rePassword),
				email: email
			},
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				if (data.r === 0) { // 注册成功
					window.location.href = '/';
				} else { // 注册失败
					$newWarning.html('<i class="icon attention"></i>' + data.msg).show();
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {

			}
		});

	});

	$('.inputPage2').focus(function() {
		$newWarning.hide();
	});


});