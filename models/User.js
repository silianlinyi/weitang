var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * username 用户名
 * password 密码
 * phone 手机号
 * qq QQ号
 * age 用户年龄，默认为0
 * sex 用户性别，默认为男
 * createTime 帐号创建日期，默认为用户注册时的服务器时间
 */
var UserSchema = new Schema({
	username: String,
	password: String,
	phone: String,
	qq: String,
	faceUrl: String,
	age: {
		type: Number,
		min: 0,
		default: 0
	},
	sex: {
		type: String,
		default: '男'
	},
	createTime: {
		type: Date,
		default: Date.now
	}
});

// define our own custom document instance methods
UserSchema.methods = {
	sayHello: function() {
		console.log('hello');
	}
};

// Adding static methods to a Model is simple as well
UserSchema.statics = {
	sayWorld: function() {
		console.log('world');
	}
};


//compile schema to model
module.exports = mongoose.model('User', UserSchema, 'wt_users');
