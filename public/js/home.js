define(function(require, exports, module) {

	function Log(str) {
		window.console && console.log(str);
	}

	// 修改模版标签为
	// <? ?>、<?= ?>、<?- ?>
	_.templateSettings = {
		evaluate : /\<\?([\s\S]+?)\?\>/g,
		interpolate : /\<\?=([\s\S]+?)\?\>/g,
		escape : /\<\?-([\s\S]+?)\?\>/g
	};

	// 页面元素
	var $loadMore = $('.loadMore');
	
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
	 * 问题集合
	 * ====================================================
	 */
	var QuestionList = Backbone.Collection.extend({
		model: Question,
	});

	/**
	 * QuestionView View
	 * 单个问题视图
	 * ====================================================
	 */
	var QuestionView = Backbone.View.extend({
		tagName: "div",
		className: "ui basic segment",
		template: $("#questionTemp").html(),
		events : {
			"click .heart": "heart",
			"click .bookmark": "bookmark",
			"click .share": "share"
		},
		
		initialize: function() {
			var me = this;
		},
		
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		},

		heart: function() {
			// TODO
			
		},

		bookmark: function() {
			// TODO
		},

		share: function() {
			// TODO
		}
	});


	/**
	 * App View
	 * 整个应用视图
	 * ====================================================
	 */
	var AppView = Backbone.View.extend({
		el: $("body"),
		events: {
			"click .loadMore": "loadMore"
		},
		
		initialize: function() {
			var me = this;
			me.questionList = new QuestionList();
			
			me.queryConfig = {
				pageStart : 0,
				pageSize : 10,
				createTime: ""
			};
			me.findQuestions();	// 页面初始化时加载10条系统消息
			me.questionList.on("add", me.renderOneQuestion, me);
		},

		/**
		 * @method renderOneQuestion
		 * 往界面中添加一个问题视图
		 */
		renderOneQuestion: function(model) {
			var me = this;

			var view = new QuestionView({
				model: model
			});
			me.$('.questionList').append(view.render().el);
		},

		/**
		 * @method findQuestionsByPage
		 * 接口函数
		 */
		findQuestionsByPage: function(succCall, failCall) {
			var me = this;
			failCall = failCall || function() {
				Log("findQuestionsByPage failCall invoked.");
			}
			$.ajax({
				url : '/api/question/findQuestionsByPage',
				type: 'POST',
				data :me.queryConfig,
				success : function(data, textStatus, jqXHR) {
					if(data.r === 0) {
						succCall(data);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					failCall();
				}
			});
		},

		/**
		 * 页面加载完成后，默认去加载pageSize条数据
		 */
		findQuestions: function() {
			var me = this,
				pageSize = me.queryConfig.pageSize;

			me.findQuestionsByPage(function(data) {
				Log(data);
				var len = data.questionList.length;
				if(len > 0 && len < pageSize) {
					me.questionList.add(data.questionList);
				} else {
					me.questionList.add(data.questionList);
					me.queryConfig.pageStart++;
					me.queryConfig.createTime = data.questionList[len - 1].createTime;
					$loadMore.show();
				}
			});
		},

		/**
		 * 点击“加载更多”
		 * @return {[type]} [description]
		 */
		loadMore: function() {
			var me = this,
				pageSize = me.queryConfig.pageSize;

			me.findQuestionsByPage(function(data) {
				Log(data);
				var len = data.questionList.length;
				if(len === 0) {
					$loadMore.html('无更多问题');
				} else if(len < pageSize) {
					me.questionList.add(data.questionList);
					me.queryConfig.pageStart++;
					me.queryConfig.createTime = data.questionList[len - 1].createTime;
					me.$('.loadMore').html("无更多问题");
				} else {
					me.questionList.add(data.questionList);
					me.queryConfig.pageStart++;
					me.queryConfig.createTime = data.questionList[len - 1].createTime;
				}
			})
		}

	});

	// 生成一个应用实例
	new AppView();











});