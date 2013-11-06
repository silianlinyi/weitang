define(function(require, exports, module) {
	
	$.fn.form.settings.defaults = {
        currentPass: {
            identifier: 'current-pass',
            rules: [
                {
                    type: 'empty',
                    prompt: '请输入您的当前密码'
                }
            ]
        },

        newPass: {
            identifier: 'new-pass',
            rules: [
                {
                    type: 'empty',
                    prompt: '请输入您的新密码'
                }
            ]
        },

        newRePass: {
            identifier: 'new-re-pass',
            rules: [
                {
                    type: 'empty',
                    prompt: '请确认您的新密码'
                }
            ]
        }
    };

    $('.ui.form').form({}, {
        inline : true,
        on: 'blur'
    });

});