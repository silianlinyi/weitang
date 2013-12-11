define(function(require, exports, module) {

	var Util = require('./util');

	var $warning = $('.warning');

    $('.resetPassword.button').click(function() {

        var email = $('input.email').val();

        if(!email) {
        	$warning.html('<i class="icon attention"></i>请输入邮箱地址').show();
        	return;
        }

        if(!Util.isEmail(email)) {
        	$warning.html('<i class="icon attention"></i>请输入有效的邮箱地址').show();
        	return;
        }

        $('.field1 .sub.header span').html(email);
        $('.field1').show();
        $('.field2').hide();
    });

    $('input.email').focus(function() {
    	$warning.hide();
    });



});