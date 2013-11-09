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

	topic: function(req, res) {
		res.render('topic');
	},

	explore: function(req, res) {
		res.render('explore');
	},

	question: function(req, res) {
		var id = _id = req.param('id');
		console.log(id);
		res.render('question');
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