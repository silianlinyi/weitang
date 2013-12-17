define(function(require, exports, module) {

	// 问题详情页面模版视图
	var questionTemp = 	'<div class="ui raised segment">' +
							'<div class="ui teal large ribbon label">' +
								'话题：' +
								// 问题所属话题的遍历
								'<% for(var i = 0; i < topics.length; i++) { %>' +
									'<%= topics[i] %>  ' +
								'<% } %>' +
							'</div>' +
							'<h3 class="ui teal header">' +
								'<img class="ui avatar left floated image" src="/img/photo2.jpg">' +
								'<div class="content">' +
									'<div  class="header"><%= title %></div>' +
								'</div>' +
							'</h3>' +
							'<p><%= content %></p>' +
						'</div>';

	/**
	 * App View
	 * 整个应用视图
	 * ====================================================
	 */
	var AppView = Backbone.View.extend({

		el: $("body"),
		events: {
			
		},
		
		initialize: function() {
			var me = this,
				href = window.location.href,
				_id = href.split("?")[1].split("=")[1];

			me.findQuestionById(_id);
		},

		findQuestionById: function(_id) {
			var me = this,
				tmpl = _.template(questionTemp);
			$.ajax({
				url: '/api/question/findQuestionById',
				type: 'POST',
				data: {
					_id: _id
				},
				dataType: 'json',
				timeout: 15000,
				success: function(data, textStatus, jqXHR) {
					console.log(data);
					if (data.r === 0) {
						me.$('.twelve.column').prepend(tmpl(data.question));
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
				}
			});
		},

		renderQuestion: function(model) {
			var me = this,
				tmpl = _.template(questionTemp);

			me.$('.twelve.column').append(tmpl(model.toJSON()));
		}

		
		


	});

	// 生成一个应用实例
	new AppView();

	// 关注、收藏、分享按钮popup提示
	$('.buttons .button').popup();

});