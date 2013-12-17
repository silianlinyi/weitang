define(function(require, exports, module) {

	require('../lib/jquery.base64.min');

	var token = window.location.href.split('?')[1].split('=')[1];
        var $message = $('.message');

        $('.save.button').click(function() {
            var password = $('.password').val().trim(),
                rePassword = $('.rePassword').val().trim();
            if(!password) {
                $message.html('<i class="icon attention"></i>请输入新密码').show();
                return;
            }
            if(!rePassword) {
                $message.html('<i class="icon attention"></i>请输入确认密码').show();
                return;
            }
            if(password !== rePassword) {
                $message.html('<i class="icon attention"></i>两次输入的密码不一致，请重新输入').show();
                return;
            }

            if(password.length < 6) {
            	$message.html('<i class="icon attention"></i>密码长度不能小于6位').show();
                return;
            }

            $.ajax({
                url : '/api/resetPassEmail',
                type: 'POST',
                data : {
                    token: token,
                    password: $.base64.encode(password),
					rePassword: $.base64.encode(rePassword),
                },
                success : function(data, textStatus, jqXHR) {
                    if(data.r === 0) {
                    	$('.field1').show();
                    	$('.field2').hide();
                    } else {
						$message.html('<i class="icon attention"></i>' + data.msg).show();
                    }
                 },
                error: function(jqXHR, textStatus, errorThrown) {
                    
                }
            });

        });

        $('input').focus(function() {
            $message.hide();
        });

});