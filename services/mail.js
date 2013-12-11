var nodemailer = require("nodemailer");
var config = require('../config');

// create reusable transport method (打开SMTP连接池)
var smtpTransport = nodemailer.createTransport("SMTP", config.mailOpts);

/**
 * 发送邮件接口函数
 */
var sendMail = function(mailOptions) {

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response);
	    }

	    // if you don't want to use this transport object anymore, uncomment following line
	    smtpTransport.close(); // shut down the connection pool, no more messages
	});

};


module.exports = {

	sendActiveMail: function(to, token, name) {

	}

};