var User = require('../models/User'),
	Question = require('../models/Question');

module.exports = {

	/**
	 * Get /index
	 */
	index: function(req, res) {
		res.render('index');
	},

	home: function(req, res) {
		res.render('home');
	},

	topic: function(req, res) {
		res.render('topic');
	},

	explore: function(req, res) {
		res.render('explore');
	},

	ask: function(req, res) {
		res.render('ask');
	},

	// 跳转到【重置密码】页面
	resetPassword: function(req, res) {
		res.render('resetPassword');
	},

	resetPassEmail: function(req, res) {
		var token = req.param('token');
		var now = (new Date()).getTime();
		var ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
		var diff = now - ONE_DAY_MILLISECONDS;

		User.findOne({
			resetToken: token,
			resetTicket: {$gt: diff}
		}, function(err, doc) {
			if (err) {
				res.render('resetPassEmail',{
					"r": 1,
					"errcode": 2007,
					"msg": "服务器错误，重置密码失败"
				});
				return;
			}

			// 没有找到
			if(!doc) {
				res.render('resetPassEmail',{
					"r": 1,
					"errcode": 2008,
					"msg": "无效的链接地址"
				});
				return;
			}

			res.render('resetPassEmail',{
				"r": 0,
				"doc": doc
			});
		});
		
		

	},

	question: function(req, res) {
		res.render('question');
	},

	account: function(req, res) {
		res.render('account');
	},

	password: function(req, res) {
		res.render('password');
	},


	idea: function(req, res) {
		res.render('idea');
	}

}