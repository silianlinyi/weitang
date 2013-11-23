define(function(require, exports, module) {

	// 问题详情页面模版视图
	var questionTemp = 	'<div class="ui raised segment">' +
							'<div class="ui teal large ribbon label">' +
								'话题：<%= topics %>' +
							'</div>' +
							'<h3 class="ui teal header">' +
								'<img class="ui avatar left floated image" src="/img/photo2.jpg">' +
								'<div class="content">' +
									'<div  class="header"><%= title %></div>' +
								'</div>' +
							'</h3>' +
							'<p><%= content %></p>' +
						'</div>';

	// 页面元素

	/**
	 * Question Model
	 * 问题模型
	 * title			问题标题
	 * content			问题详细内容
	 * author 			问题作者_id
	 * topics			问题所属话题
	 * answerCounter	问题回答个数
	 * viewCounter		问题被查看次数
	 * createTime		问题创建时间
	 * updateTime		问题最后更新时间
	 * ====================================================
	 */ 
	var Question = Backbone.Model.extend({
		defaults: {
			title: '',
			content: '',
			author: '',
			topics: '',
			answerCounter: 0,
			viewCounter: 0,
			createTime: '',
			updateTime: ''
		}
	});

	/**
	 * QuestionList Collection
	 * 系统消息集合
	 * ====================================================
	 */
	var QuestionList = Backbone.Collection.extend({
		model: Question,
	});

	/**
	 * App View
	 * 整个应用视图
	 * ====================================================
	 */
	var AppView = Backbone.View.extend({

		el: $("#questionApp"),
		events: {
			
		},
		
		initialize: function() {
			var me = this,
				href = window.location.href;
			me.questionList = new QuestionList();
			me.config = {
				_id: href.split("?")[1].split("=")[1]
			};

			me.findQuestion();
			me.questionList.on("add", me.renderQuestion, me);
		},

		renderQuestion: function(model) {
			var me = this,
				tmpl = _.template(questionTemp);

			me.$('.twelve.column').append(tmpl(model.toJSON()));
		},

		
		findQuestion: function() {
			var me = this;
			$.ajax({
				url: '/api/question/findQuestionById',
				type: 'POST',
				data: me.config,
				dataType: 'json',
				timeout: 15000,
				success: function(data, textStatus, jqXHR) {
					console.log(data);
					if (data.r === 0) {
						me.questionList.add(data.question);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
				}
			});
		}


	});

	// 生成一个应用实例
	new AppView();

	// 关注、收藏、分享按钮popup提示
	$('.buttons .button').popup();

});