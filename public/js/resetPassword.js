define(function(require, exports, module) {

	var Util = require('./util');

	var $warning = $('.warning');

    // 点击“重设密码”
    $('.resetPassword.button').click(function() {
        
        var email = $('input.email').val().trim();
        if(!email) {
        	$warning.html('<i class="icon attention"></i>请输入邮箱地址').show();
        	return;
        }

        if(!Util.isEmail(email)) {
        	$warning.html('<i class="icon attention"></i>请输入有效的邮箱地址').show();
        	return;
        }

        $('.ui.dimmer').dimmer({
            closable: false,
            duration: {
                show: 1,
                hide: 1
            }
        })
        $('.ui.dimmer').dimmer('show');

        $.ajax({
            url : '/api/resetPassword',
            type: 'POST',
            data : {
                email: email
            },
            success : function(data, textStatus, jqXHR) {
                if(data.r === 0) {
                    $('.field1 .sub.header span').html(email);
                    $('.field1').show();
                    $('.field2').hide();
                    $('.ui.dimmer').dimmer('hide');
                } else {
                    $warning.html('<i class="icon attention"></i>' + data.msg).show();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                failCall();
            }
        });
    });

    $('input.email').focus(function() {
    	$warning.hide();
    });



});