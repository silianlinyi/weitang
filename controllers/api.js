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
				// 用户登录成功后，将用户的_id属性添加到session对象
				req.session._id = doc._id;
				console.log("登录成功 req.session._id = " + req.session._id);
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
	 * 用户主动注销时，将session中的_id属性删除
	 */
	logout: function(req, res) {
		console.log("删除前：" + req.session._id);
		delete req.session._id;
		console.log("删除后：" + req.session._id);
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

						console.log(user);

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

		}

	},

	/**
	 * 添加一个问题
	 */
	addQuestion: function(req, res) {
		var body = req.body,
			title = body.title,
			content = body.content,
			author = req.session._id,
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
	 * @method findQuestionById
	 * 通过问题的_id属性来查找某个问题
	 */
	findQuestionById: function(req, res) {
		var _id = req.param('_id');
		console.log("findQuestionById _id = " + _id);

		Question.findById(new ObjectId(_id), function(err, doc) {
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

		console.log("pageSize = " + pageSize);
		console.log("pageStart = " + pageStart);
		console.log("createTime = " + createTime);

		// 如果用户是第一次查询，则根据pageSize返回前10条数据
		// 如果用户不是第一次查询（pageStart > 0），则根据pageSize和createTime返回10条数据
		if(pageStart === 0) { // 说明用户是第一次查询
			console.log("用户是第一次查询");
			// sort('-createTime')，最新的先返回
			// sort('createTime'),最早的先返回
			query = Question.find().sort('-createTime').limit(pageSize);
		} else { // 说明用户不是第一次查询
			console.log("说明用户不是第一次查询");
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
	}

	


}