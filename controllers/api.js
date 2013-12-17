var check = require('validator').check,
    sanitize = require('validator').sanitize;

var mail = require('../services/mail');

var Util = require('../common/util');

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
	 * @method userAuth
	 * 用户认证
	 * session对象中有_id属性，说明用户已经登录，验证通过，否则说明用户未登录
	 */
	userAuth: function(req, res, next) {
		if (req.session._id) {
			console.log("【Debug】：用户验证成功");
			next();
		} else {
			console.log("【Debug】：用户验证失败");
			res.render('index');
		}
	},

	/**
	 * @method login
	 * 登录
	 */
	login: function(req, res) {
		var username = req.param('username'),
			password = req.param('password');

		User.findOne({
			'$or': [{
				'username': username
			}, {
				'email': username
			}],
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
				// 用户登录成功后，将用户的_id属性添加到session对象
				req.session._id = doc._id;
				console.log("【日志】：登录成功 req.session._id = " + req.session._id);
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
	 * @method logout
	 * 退出
	 * 用户主动注销时，将session中的_id属性删除，并重定向到登录页面
	 */
	logout: function(req, res) {
		delete req.session._id;
		res.redirect('/index');
	},

	/**
	 * @method signup
	 * 注册
	 */
	signup: function(req, res) {
		var username = req.param('username'),
			password = req.param('password'),
			rePassword = req.param('rePassword'),
			email = req.param('email');

		if(username === '' || password === '' || rePassword === '' || email === '') {
			res.json({
				"r": 1,
				"errcode": 1001,
				"msg": "注册信息不完整"
			});
			return;
		}

		if(username.length < 5) {
			res.json({
				"r": 1,
				"errcode": 1004,
				"msg": "用户名至少需要5个字符"
			});
			return;
		}

		try {
			check(username).isAlphanumeric();
		} catch(e) {
			res.json({
				"r": 1,
				"errcode": 1005,
				"msg": "用户名只能使用0-9，a-z，A-Z"
			});
			return;
		}

		if(password !== rePassword) {
			res.json({
				"r": 1,
				"errcode": 1002,
				"msg": "两次输入的密码不一致"
			});
			return;
		}

		try {
			check(email).isEmail();
		} catch(e) {
			res.json({
				"r": 1,
				"errcode": 1006,
				"msg": "不正确的电子邮箱地址"
			});
			return;
		}

		User.findOne({
			'$or': [{
				'username': username
			}, {
				'email': email
			}]
		}, function(err, doc) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2001,
					"msg": "服务器错误，注册失败"
				});
				return;
			} else {
				if(!!doc) {
					res.json({
						"r": 1,
						"errcode": 1003,
						"msg": "该用户名或邮箱已经被注册"
					});
					return;
				} else {
					var user = new User({
						username: username,
						password: md5(password),
						email: email
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
							// 注册成功后，将用户的_id写入session，表示用户已经登录
							req.session._id = user._id;
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

	},

	/**
	 * @method addQuestion
	 * 添加一个问题
	 */
	addQuestion: function(req, res) {
		var title = req.param('title'),
			content = req.param('content'),
			author = req.session._id,
			topics = req.param('topics');

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
	 * @method findQuestionById
	 * 通过问题的_id属性来查找某个问题
	 */
	findQuestionById: function(req, res) {
		var _id = req.param('_id');

		// { $inc: { viewCounter: 1 }}文章查看次数自增
		Question.findByIdAndUpdate(new ObjectId(_id), {
			$inc: { viewCounter: 1 }
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
					"question": doc
				});
			} else {
				res.json({
					"r": 1,
					"errcode": 2005,
					"msg": "没有找到该问题，404"
				});
			}
		});
	},

	/**
	 * @method findQuestionsByPage
	 * 分页查询
	 */
	findQuestionsByPage: function(req, res) {
		var pageSize = Number(req.param('pageSize')),
			pageStart = Number(req.param('pageStart')),
			createTime = req.param('createTime'),
			query;

		// 如果用户是第一次查询，则根据pageSize返回前pageSize条数据
		// 如果用户不是第一次查询（pageStart > 0），则根据pageSize和createTime返回pageSize条数据
		if(pageStart === 0) { // 说明用户是第一次查询
			// sort('-createTime')，最新的先返回
			// sort('createTime'),最早的先返回
			console.log("【日志】：用户是第一次查询");
			query = Question.find().sort('-createTime').limit(pageSize);
		} else { // 说明用户不是第一次查询
			console.log("【日志】：用户不是第一次查询");
			query = Question.find({
				createTime: { $lt: createTime }
			}).sort('-createTime').limit(pageSize);
		}

		query.exec(function(err, docs) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2004,
					"msg": "服务器错误，查找问题失败"
				});
				return;
			}

			res.json({
				"r": 0,
				"msg": "查找问题成功",
				"questionList": docs
			});
		});
	},

	/**
	 * @method searchQuestionsByTitle
	 * 通过问题Title查找符合条件的问题
	 */
	searchQuestionsByTitle: function(req, res) {
		var title = req.param('title');
		console.log("searchQuestionsByTitle: title = " + title);

		Question.find({
			title: new RegExp(title)
		}, function(err, docs) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2004,
					"msg": "服务器错误，查找问题失败"
				});
				return;
			}

			if(docs.length !== 0) {
				res.json({
					"r": 0,
					"msg": "查找问题成功",
					"questionList": docs
				});
			} else {
				res.json({
					"r": 1,
					"errcode": 2005,
					"msg": "没有找到该问题，404"
				});
			}
		});
	},

	/**
	 * @method searchQuestionsByContent
	 * 通过问题content查找符合条件的问题
	 */
	searchQuestionsByContent: function(req, res) {
		var content = req.param('content');
		console.log("searchQuestionsByContent: content = " + content);

		Question.find({
			content: new RegExp(content)
		}, function(err, docs) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2004,
					"msg": "服务器错误，查找问题失败"
				});
				return;
			}

			if(docs.length !== 0) {
				res.json({
					"r": 0,
					"msg": "查找问题成功",
					"questionList": docs
				});
			} else {
				res.json({
					"r": 1,
					"errcode": 2005,
					"msg": "没有找到该问题，404"
				});
			}
		});
	},

	/**
	 * @method resetPassword
	 * 重置密码
	 */
	resetPassword: function(req, res) {
		var to = req.param('email');
		var ticket = (new Date()).getTime();	// 重置密码触发事件
		var token = Util.randomString(30);		// 重置密码token

		User.findOneAndUpdate({
			email: to
		}, { 
			$set: {
				resetTicket: ticket,
				resetToken: token 
			}
		}, function(err, doc) {
			if (err) {
				res.json({
					"r": 1,
					"errcode": 2006,
					"msg": "服务器错误，重置密码失败"
				});
				return;
			}

			if(!doc) {
				res.json({
					"r": 1,
				    "errcode": 1007,
				    "msg": "该邮箱尚未被注册"
				});
				return;
			}

			// 该邮箱已注册，往该邮箱发送一封重置密码邮件
			mail.sendResetPassMail(to, token, function(response) {
		        res.json({
					"r": 0,
					"msg": "发送重置密码邮件成功"
				});
			});

		});
		
	},

	// 修改密码
	resetPassEmail: function(req, res) {
		var token = req.param('token'),
			password = req.param('password'),
			rePassword = req.param('rePassword');

		if(password != rePassword) {
			res.json({
				"r": 1,
				"errcode": 1008,
				"msg": "两次输入的密码不一致"
			});
			return;
		}

		User.findOneAndUpdate({
			resetToken: token
		}, {
			$set: {
				password: md5(password),
				resetToken: '',
				resetTicket: 0
			}
		}, function(err, doc) {
			if (err) {
				res.json({
					"r": 1,
					"errcode": 2009,
					"msg": "服务器错误，重置密码失败"
				});
				return;
			}

			res.json({
				"r": 0,
				"msg": "重置密码成功"
			});
		});

	},


	modifyPassword: function(req, res) {
		var currentPass = req.param('currentPass'),
			newPass = req.param('newPass'),
			reNewPass = req.param('reNewPass'),
			_id = req.session._id;

		if(!currentPass || !newPass || !reNewPass) {
			res.json({
				"r": 1,
				"errcode": 1009,
				"msg": "修改密码信息填写不完整"
			});
			return;
		}

		if(newPass !== reNewPass) {
			res.json({
				"r": 1,
				"errcode": 1010,
				"msg": "修改密码，两次输入的密码不一致"
			});
			return;
		}

		User.findOneAndUpdate({
			_id: new ObjectId(_id),
			password: md5(currentPass)
		}, { 
			$set: {
				password: md5(newPass)
			}
		}, function(err, doc) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2010,
					"msg": "服务器错误，修改密码失败"
				});
				return;
			}

			if(!doc) {
				res.json({
					"r": 1,
					"errcode": 1011,
					"msg": "修改密码，当前密码不正确"
				});
				return;
			}

			res.json({
				"r": 0,
				"msg": "修改密码成功"
			});
			return;
		});
	}

	
	


}