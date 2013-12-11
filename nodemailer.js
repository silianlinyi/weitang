var nodemailer = require("nodemailer");

// create reusable transport method (打开SMTP连接池)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "silianlinyi@gmail.com",
        pass: "sangjijia"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "微糖 <weitang@gmail.com>", // sender address
    to: "244098979@qq.com", // list of receivers
    subject: "微糖：设置新密码", // Subject line
    text: "text", // plaintext body
    html: "<h3>王干：你好<h3><hr><p>微糖已经收到了你的密码重置请求，请您点击此链接重置密码（链接将在24小时后失效）：" + 
    "http://www.weitang.com/activateemail?email=dHpod2cwODI5QDEyNi5jb20%3D&ticket=326a60d073e65dde6fd59f2308f38f17558a3e05</p>" +
    "<hr><p>© 2013 微糖，这是一封系统邮件，请不要直接回复。</p>"
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent successfully");
        for(var res in response) {
            console.log(res + ' = ' + response[res]);
        }
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
});

// 微信公共号激活链接
// https://mp.weixin.qq.com/cgi-bin/activateemail?email=dHpod2cwODI5QDEyNi5jb20%3D&ticket=326a60d073e65dde6fd59f2308f38f17558a3e05