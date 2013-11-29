var nodemailer = require("nodemailer");

// create reusable transport method (打开SMTP连接池)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "weitang@gmail.com",
        pass: "sangjijia"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "weitang <weitang@gmail.com>", // sender address
    to: "244098979@qq.com", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world", // plaintext body
    html: "<b>Hello world</b>" // html body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});

// 微信公共号激活链接
// https://mp.weixin.qq.com/cgi-bin/activateemail?email=dHpod2cwODI5QDEyNi5jb20%3D&ticket=326a60d073e65dde6fd59f2308f38f17558a3e05