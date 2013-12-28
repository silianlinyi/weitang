var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * belongTo 属于哪个问题的回复
 * content 回复详细内容
 * author 回复作者
 * createTime 回复创建时间
 * updateTime 回复最后更新时间
 */
var ReplySchema = new Schema({
	belongTo: String,
	content: String,
	author: String,
	createTime: {
		type: Date,
		default: Date.now
	},
	updateTime: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Reply', ReplySchema, 'wt_replys');