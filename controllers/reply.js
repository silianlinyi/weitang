var Reply = require('../models/Reply');

module.exports = {

	/**
	 * 添加一条问题回复
	 */
	addReply: function(req, res) {
		var content = req.param('content'),
			author = req.session._id,
			belongTo = req.param('belongTo');

		if (content === "") {
			res.json({
				"r": 1,
				"errcode": 3000,
				"msg": "回复内容不能为空"
			});
			return;
		}

		var reply = new Reply({
			content: content,
			author: author,
			belongTo: belongTo
		});

		reply.save(function(err) {
			if (err) {
				res.json({
					"r": 1,
					"errcode": 2011,
					"msg": "服务器错误，回复保存失败"
				});
				return;
			}
			res.json({
				"r": 0,
				"msg": "添加回复成功"
			});
			return;
		});
	},

	findReplysByBelongTo: function(req, res) {
		var belongTo = req.param('belongTo');

		Reply.find({
			belongTo: belongTo
		}, function(err, docs) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 2012,
					"msg": "服务器错误，查找问题回复失败"
				});
				return;
			}

			res.json({
				"r": 0,
				"msg": "查找问题回复成功",
				"replyList": docs
			});
		});
	}

};