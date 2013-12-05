/**
 * 后台Ajax的封装
 * @author silianlinyi
 */
define(function(require, exports, module) {
	
	// 加载依赖模块
	var log = require('../lib/log');

	var Interface = {};

	/**
	 * @method login
	 * 登录接口
	 * @param  {Object} config   登录参数对象
	 * @param  {Function} succCall 成功回调函数
	 * @param  {Function} [failCall] 可选，失败回调函数
	 */
	Interface.login = function(config, succCall, failCall) {
		failCall = failCall || function() {
			log("[/api/login]：default failCall invoked.");
		}
		$.ajax({
			url: '/api/login',
			type: 'POST',
			data: config,
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				succCall(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				failCall();
			}
		});
	};

	/**
	 * @method signup
	 * 注册接口
	 * @param  {Object} config   注册参数对象
	 * @param  {Function} succCall 成功回调函数
	 * @param  {Function} [failCall] 可选，失败回调函数
	 */
	Interface.signup = function(config, succCall, failCall) {
		failCall = failCall || function() {
			log("[/api/signup]：default failCall invoked.");
		}
		$.ajax({
			url: '/api/signup',
			type: 'POST',
			data: config,
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				succCall(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				failCall();
			}
		});
	};

	/**
	 * @method addQuestion
	 * 添加一个问题接口
	 * @param  {Object} config 参数
	 * @param  {Function} succCall 成功回调函数
	 * @param  {Function} [failCall] 可选，失败回调函数
	 */
	Interface.addQuestion = function(config, succCall, failCall) {
		failCall = failCall || function() {
			log("[/api/question/addQuestion]：default failCall invoked.");
		}
		$.ajax({
			url: '/api/question/addQuestion',
			type: 'POST',
			data: config,
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				succCall(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				failCall();
			}
		});
	};

	/**
	 * @method findQuestionsByPage
	 * 分页查询接口
	 * @param  {Object} config 参数
	 * @param  {Function} succCall 成功回调函数
	 * @param  {Function} [failCall] 可选，失败回调函数
	 */
	Interface.findQuestionsByPage = function(config, succCall, failCall) {
		failCall = failCall || function() {
			log("[/api/question/findQuestionsByPage]：default failCall invoked.");
		}
		$.ajax({
			url : '/api/question/findQuestionsByPage',
			type: 'POST',
			data : config,
			success : function(data, textStatus, jqXHR) {
				succCall(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				failCall();
			}
		});
	};







	module.exports = Interface;

});