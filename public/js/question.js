define(function(require, exports, module) {

	var Util = require('./util');

	// 问题详情页面模版视图
	var questionTemp = 	'<div class="ui raised segment">' +
							'<div class="ui teal large ribbon label">' +
								'话题：' +
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

	var replyTemp = '<div class="comment">' +
						'<a class="avatar"><img src="/img/photo2.jpg"></a>' +
						'<div class="content">' +
							'<a class="author"><%=author%></a>' +
							'<div class="metadata">' +
								'<div class="date"><%=createTimeLocal%></div>' +
							'</div>' +
							'<div class="text"><%=content%></div>' +
							'<div class="actions">' +
								'<a class="reply active">回复</a>' +
								'<a class="delete">删除</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="ui divider"></div>';

	/**
	 * App View
	 * 整个应用视图
	 * ====================================================
	 */
	var AppView = Backbone.View.extend({

		el: $("body"),

		events: {
			"click .addReply": "addReply"
		},

		initialize: function() {
			var self = this;
			self.href = window.location.href,
			self._id = self.href.split("?")[1].split("=")[1];
			self.findQuestionById(self._id);
			self.findReplysByBelongTo(self._id);
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

		addReply: function() {
			var self = this;
			var content = $('.reply .content').val().trim();
			var belongTo = self._id;

			if(content === "") {
				alert('回复内容不能为空');
				return false;
			}

			$.ajax({
				url: '/api/reply/addReply',
				type: 'POST',
				data: {
					content: content,
					belongTo: belongTo
				},
				dataType: 'json',
				timeout: 15000,
				success: function(data, textStatus, jqXHR) {
					console.log(data);
				},
				error: function(jqXHR, textStatus, errorThrown) {

				}
			});
		},

		findReplysByBelongTo: function(belongTo) {
			var self = this,
				tmpl = _.template(replyTemp);
			$.ajax({
				url: '/api/reply/findReplysByBelongTo',
				type: 'GET',
				data: {
					belongTo: belongTo
				},
				dataType: 'json',
				timeout: 15000,
				success: function(data, textStatus, jqXHR) {
					console.log(data);
					var reply;
					if(data.r === 0) {
						for(var i = 0; i < data.replyList.length; i++) {
							reply = data.replyList[i];
							reply.createTimeLocal = Util.convertDate(reply.createTime);
							self.$('.comments').prepend(tmpl(reply));
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {

				}
			});
		}



		



	});

	// 生成一个应用实例
	window.app = new AppView();

	// 关注、收藏、分享按钮popup提示
	$('.buttons .button').popup();

});