module.exports = {

	/**
	 * 用户认证
	 */
	userAuth: function(req, res, next) {
		if (req.session.username) {
			console.log("【Debug】：用户验证成功");
			next();
		} else {
			console.log("【Debug】：用户验证失败");
			res.render('signin');
		}
	},

	/**
	 * 登录操作
	 */
	login: function(req, res) {
		var username = req.body.username,
			password = req.body.password;

		if ((username === "wanggan" || "15158132863" || "244098979@qq.com") && password === "12345") {
			req.session.username = username;
			res.json({
				"r": 0,
				"msg": "登录成功"
			});
		} else {
			res.json({
				"r": 1,
				"errcode": 1000,
				"msg": "用户名或密码错误"
			});
		}
	},

	/**
	 * 退出操作
	 */
	logout: function(req, res) {
		console.log("删除前：" + req.session.username);
		delete req.session.username;
		console.log("删除后：" + req.session.username);
		res.redirect('/signin');
	}


}