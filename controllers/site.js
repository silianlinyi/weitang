module.exports = {

	/**
	 * Get /signin
	 */
	signin: function(req, res) {
		res.render('signin');
	},

	index: function(req, res) {
		res.render('index');
	},

	account: function(req, res) {
		res.render('account');
	},

	password: function(req, res) {
		res.render('password');
	},


	idea: function(req, res) {
		res.render('idea');
	}

}