define(function(require, exports, module) {

	var Util = {};

	// 1分钟前
	// 2分钟前
	// 3分钟前
	// ......
	// 59分前

	// 1小时前
	// 2小时前
	// ......
	// 23小时前

	// 1天前
	// 2天前
	// ......
	// 6天前

	// 1周前

	Util.convertDate = function(date) {
		var 


		var dateMilliseconds = Date.parse(date),
			currentMilliseconds = (new Date()).getTime(),
			defference = currentMilliseconds - dateMilliseconds;


	}

	




	module.exports = Util;

});