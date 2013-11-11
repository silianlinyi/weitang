var User = require('../models/User'),
	Question = require('../models/Question');

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
		console.log(req.param('_id'));
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