var nodemailer = require("nodemailer");

var config = require('../config');

// create reusable transport method (打开SMTP连接池)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "silianlinyi@gmail.com",
        pass: "sangjijia"
    }
});

/**
 * 发送邮件接口函数
 */
var sendMail = function(mailOptions, callback) {
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent successfully");
	        callback(response);
	    }
	    smtpTransport.close();
	});
};


module.exports = {

	/**
	 * @method sendResetPassMail
	 * 发送重置密码邮件
	 */
	sendResetPassMail: function(to, token, callback) {
		var mailOptions = {
		    from: "微糖 <weitang@gmail.com>",
		    to: to,
		    subject: "微糖：设置新密码",
		    text: "text",
		    html: "<h3>王干：你好<h3><hr><p>微糖已经收到了你的密码重置请求，请您点击此链接重置密码（链接将在24小时后失效）：" + 
		    "http://" + config.DOMAIN + "/resetPassEmail?token=" + token + "</p>" +
		    "<hr><p>© 2013 微糖，这是一封系统邮件，请不要直接回复。</p>"
		};
		sendMail(mailOptions, callback);
	}

};