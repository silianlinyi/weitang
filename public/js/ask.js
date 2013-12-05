define(function(require, exports, module) {

	// 加载依赖模块
	var log = require('../lib/log');
	var $I = require('./interface');

	/**
	 * 移除数组中指定的一个元素
	 * @param {[type]} val 数组中某个元素的值
	 */
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		for(var i = index; i < this.length - 1; i++) {
			this[i] = this[i + 1];
		}
		this.pop();
	};

	var hasAddedTopics = []; // 保存已添加话题的数组

	var $addButton = $('.add.button'),
		$title = $('.form .title'),
		$content = $('.form .content'),
		$topics = $('.form .topics'),
		$hasAddedList = $('.hasAddedList'); 

	// 给热门标签添加单击事件
	$('.hotTopics .label').on('click', function(e) {
		if(hasAddedTopics.length === 5) {
			alert("最多只能添加5个标签");
			return;
		}
		var topic = $(this).html(),
			$label = $('<div class="ui label">' + topic + '<i class="delete icon"></i></div>');
		$hasAddedList.append($label);
		hasAddedTopics.push(topic);

		$label.find('.delete').click(function(e) {
			var topic = $(this).parent().text();
			hasAddedTopics.remove(topic);
			$(this).parent().remove();
		});
	});
	
	// 点击“提交问题”
	$addButton.click(function() {
		var title = $title.val(),
			content = $content.val();

		if(!title) {
			alert("问题标题不能为空");
			return;
		}

		if(hasAddedTopics.length === 0) {
			alert("问题所属话题至少有一个");
			return;
		}

		$I.addQuestion({
			title: title,
			content: content,
			topics: hasAddedTopics
		}, function(data) {
			if (data.r === 0) {
				alert(data.msg);
				window.location.reload();
			}
		});
		
	});

});