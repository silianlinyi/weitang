define(function(require, exports, module) {

	var $addButton = $('.add.button'),
		$title = $('.form .title'),
		$content = $('.form .content'),
		$topics = $('.form .topics');
	
	$addButton.click(function() {
		var title = $title.val(),
			content = $content.val(),
			topics = $topics.val();

		if(!title) {
			alert("问题标题不能为空");
			return;
		}

		if(!topics) {
			alert("问题所属话题至少有一个");
			return;
		}

		$.ajax({
			url: '/api/question/addQuestion',
			type: 'POST',
			data: {
				title: title,
				content: content,
				topics: topics.split(' ')
			},
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				if (data.r === 0) {
					alert(data.msg);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {

			}
		});


	});

});