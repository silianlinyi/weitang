define(function(require, exports, module) {

    require('../lib/jquery.base64.min');

    var $message = $('.warning.message');

    // 点击“保存”按钮
    $('.save.button').click(function() {
        var currentPass = $('.currentPass').val().trim(),
            newPass = $('.newPass').val().trim(),
            reNewPass = $('.reNewPass').val().trim();

        if(!currentPass) {
            $message.html('<i class="icon attention"></i>当前密码不能为空').show();
            return;
        }
        if(!newPass) {
            $message.html('<i class="icon attention"></i>新密码不能为空').show();
            return;
        }
        if(!reNewPass) {
            $message.html('<i class="icon attention"></i>确认新密码不能为空').show();
            return;
        }
        if(newPass !== reNewPass) {
            $message.html('<i class="icon attention"></i>两次输入的密码不一致，请重新输入').show();
            return;
        }
        
        $.ajax({
            url : '/api/modifyPassword',
            type: 'POST',
            data : {
                currentPass: $.base64.encode(currentPass),
                newPass: $.base64.encode(newPass),
                reNewPass: $.base64.encode(reNewPass)
            },
            success : function(data, textStatus, jqXHR) {
                if(data.r === 0) {
                    $message.html('<i class="icon right"></i>密码修改成功').show();
                    return;
                } else {
                    $message.html('<i class="icon attention"></i>' + data.msg).show();
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });


    });


});