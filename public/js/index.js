define(function(require, exports, module) {

	require('../lib/jquery.base64.min.js');

	// 登录
	// -------------------------------------------
	var $signinBtn = $('.signin.button'),
		$username = $('.page1 .username'),
		$password = $('.page1 .password'),
		$warning = $('.page1 .warning');

	$signinBtn.click(function() {
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
				password: $.base64.encode(password)
			},
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				debugger
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


	$('body').keydown(function(e) {
		if(e.keyCode === 13) {
			$signinBtn.click();
		}
	});

	// 注册
	// -------------------------------------------
	$('.labeled.signup.button').click(function() {
		$('.page2 .form').fadeIn();
	});

	var $signup = $('.submit.signup.button'),
		$newUsername = $('.page2 .username'),
		$newPassword = $('.page2 .password'),
		$rePassword = $('.page2 .rePassword'),
		$newWarning = $('.page2 .warning');

	$signup.click(function() {
		var username = $newUsername.val(),
			password = $newPassword.val(),
			rePassword = $rePassword.val();
		if (!username) {
			$newWarning.html('<i class="icon attention"></i>请输入用户名').show();
			return;
		} else {
			if(!password) {
				$newWarning.html('<i class="icon attention"></i>请输入密码').show();
				return;
			} else if(!rePassword) {
				$newWarning.html('<i class="icon attention"></i>请输入确认密码').show();
				return;
			} else if(password !== rePassword) {
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
					rePassword: $.base64.encode(rePassword)
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
		}
	});

	$newUsername.focus(function() {
		$newWarning.hide();
	});

	$newPassword.focus(function() {
		$newWarning.hide();
	});

	$rePassword.focus(function() {
		$newWarning.hide();
	});


	

});