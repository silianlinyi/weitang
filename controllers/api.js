var mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;
var crypto = require('crypto');

function md5 (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

var User = require('../models/User'),
	Question = require('../models/Question');

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
			res.render('index');
		}
	},

	/**
	 * 登录操作
	 */
	login: function(req, res) {
		var username = req.body.username,
			password = req.body.password;

		User.findOne({
			username: username,
			password: md5(password)
		}, function(err, doc) {
			if (err) {
				res.json({
					"r": 1,
					"errcode": 2002,
					"msg": "服务器错误，登录失败"
				});
				return;
			}

			if ( !! doc) {
				req.session.username = doc.username;
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
		});
	},

	/**
	 * 退出操作
	 */
	logout: function(req, res) {
		console.log("删除前：" + req.session.username);
		delete req.session.username;
		console.log("删除后：" + req.session.username);
		res.redirect('/index');
	},

	/**
	 * 注册操作
	 */
	signup: function(req, res) {
		var username = req.body.username,
			password = req.body.password,
			rePassword = req.body.rePassword;

		if(!username || !password || !rePassword) {
			res.json({
				"r": 1,
				"errcode": 1001,
				"msg": "注册信息不完整"
			});
		} else if(password !== rePassword) {
			res.json({
				"r": 1,
				"errcode": 1002,
				"msg": "两次输入的密码不一致"
			});
		} else {
			User.findOne({
				username: username
			}, function(err, doc) {
				if(err) {
					res.json({
						"r": 1,
						"errcode": 2000,
						"msg": "服务器错误"
					});
					return;
				} else {
					if(!!doc) {
						res.json({
							"r": 1,
							"errcode": 1003,
							"msg": "该用户名已经被注册"
						});
						return;
					} else {
						var user = new User({
							username: username,
							password: md5(password)
						});

						user.save(function(err) {
							if(err) {
								res.json({
									"r": 1,
									"errcode": 2001,
									"msg": "服务器错误，注册失败"
								});
								return;
							} else {
								req.session.username = username;
								res.json({
									"r": 0,
									"msg": "注册成功"
								});
								return;
							}
						});
					}
				}
			});	

		}

	},

	/**
	 * 添加一个问题
	 */
	addQuestion: function(req, res) {
		var body = req.body,
			title = body.title,
			content = body.content,
			author = req.session.username,
			topics = [];

		var question = new Question({
			title: title,
			content: content,
			author: author,
			topics: topics
		});

		question.save(function(err) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2003,
					"msg": "服务器错误，添加问题失败"
				});
				return;
			} else {
				res.json({
					"r": 0,
					"msg": "添加问题成功"
				});
				return;
			}
		});
	},

	/**
	 * 从数据库中查找某个问题
	 */
	getQuestion: function(req, res) {
		var _id = req.param('_id');
		console.log(_id);

		Question.findOne({
			_id: new ObjectId(_id)
		}, function(err, doc) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2004,
					"msg": "服务器错误，查找问题失败"
				});
				return;
			}

			if(!!doc) {
				res.json({
					"r": 0,
					"msg": "查找问题成功",
					"doc": doc
				});
			} else {
				res.json({
					"r": 1,
					"errcode": 2005,
					"msg": "没有找到该问题，404"
				});
			}
		})
	}


}