var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * username 用户名
 * password 密码
 * email 电子邮箱
 * phone 手机号
 * qq QQ号
 * age 用户年龄，默认为0
 * sex 用户性别，默认为男
 * createTime 帐号创建日期，默认为用户注册时的服务器时间
 * url 个人网站
 * active 帐号是否激活
 */
var UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	password: String,
	email: {
		type: String,
		unique: true
	},
	phone: String,
	qq: String,
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
	},
	url: String,
	active: {
		type: Boolean,
		default: false
	},
	resetTicket: {
		type: Number,
		default: 0
	},
	resetToken: {
		type: String,
		default: ''
	}
});

// 添加实例方法
UserSchema.methods = {
	sayHello: function() {
		console.log('hello');
	}
};

// 添加静态方法
UserSchema.statics = {
	sayWorld: function() {
		console.log('world');
	}
};


//compile schema to model
module.exports = mongoose.model('User', UserSchema, 'wt_users');
