define(function(require, exports, module) {

	var Util = {};

	/**
	 * @method convertDate
	 * 将ISO标准时间格式转换成用户更乐意接受的形式
	 * 例如："2013-12-02T10:54:43.253Z" -> "1小时前"
	 */
	Util.convertDate = function(date) {
		var ONE_MINUTE_MILLISECONDS = 1 * 60 * 1000,
			ONE_HOUR_MILLISECONDS = ONE_MINUTE_MILLISECONDS * 60,
			ONE_DAY_MILLISECONDS = ONE_HOUR_MILLISECONDS * 24;

		var dateMilliseconds = Date.parse(date),
			currentMilliseconds = (new Date()).getTime(),
			difference = currentMilliseconds - dateMilliseconds;

		for(var i = 1; i < 60; i++) {
			if(difference < ONE_MINUTE_MILLISECONDS * i) {
				return i + "分钟前";
			}
		}

		for(var j = 1; j < 24; j++) {
			if(difference < ONE_HOUR_MILLISECONDS * j) {
				return j + "小时前";
			}
		}

		for(var k = 1; k < 30; k++) {
			if(difference < ONE_DAY_MILLISECONDS * k) {
				return k + "天前";
			}
		}

		return (new Date(date)).toLocaleDateString();
	}

	




	module.exports = Util;

});