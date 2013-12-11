var User = require('../models/User'),
	Question = require('../models/Question');

module.exports = {

	/**
	 * Get /index
	 */
	index: function(req, res) {
		res.render('index');
	},

	home: function(req, res) {
		res.render('home');
	},

	topic: function(req, res) {
		res.render('topic');
	},

	explore: function(req, res) {
		res.render('explore');
	},

	ask: function(req, res) {
		res.render('ask');
	},

	resetPassword: function(req, res) {
		res.render('resetPassword');
	},

	question: function(req, res) {
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