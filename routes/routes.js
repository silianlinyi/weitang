var site = require('../controllers/site'),
	api = require('../controllers/api');

module.exports = function(app) {
	
	app.get('/index', site.index);
	app.get('/', api.userAuth, site.home);
	app.get('/home', api.userAuth, site.home);
	app.get('/topic', api.userAuth, site.topic);
	app.get('/explore', api.userAuth, site.explore);
	app.get('/question/:_id', site.question);
	app.get('/ask', site.ask);


	

	app.get('/settings/*', api.userAuth);
	app.get('/settings/account', site.account);
	app.get('/settings/password', site.password);

	app.post('/api/signup', api.signup);
	app.post('/api/login', api.login);
	app.get('/api/logout', api.logout);
	app.post('/api/addQuestion', api.addQuestion);
	
	


	app.get('/idea', site.idea);

	/**
	 * 404 Page
	 */
	app.get('*', function(req, res, next) {
		if (/.*\.(gif|jpg|jpeg|png|bmp|js|css|html|eot|svg|ttf|woff|otf|ico).*$/.test(req.originalUrl)) {
			next();
		} else {
			res.render('404');
		}
	});


}