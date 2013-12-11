module.exports = {
	
	/**
	 * @method randomString
	 * 产生一段随机字符串
	 * @param  {Number} [size] 可选，产生的随机字符串的长度
	 * @return {String} 一段随机字符串
	 */
	randomString: function(size) {
		size = size || 6;
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
			maxNum = chars.length + 1,
			ret = '';
		while(size > 0) {
			ret += chars.charAt(Math.floor(Math.random() * maxNum));
			size--;
		}
		return ret;
	}




	
}