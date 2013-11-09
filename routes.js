var site = require('./controllers/site'),
	api = require('./controllers/api');

module.exports = function(app) {

	app.get('/', api.userAuth, site.index);
	app.get('/index', site.index);
	app.get('/topic', api.userAuth, site.topic);
	app.get('/explore', api.userAuth, site.explore);
	app.get('/question/:id', site.question);



	app.get('/signin', site.signin);
	app.get('/settings/account', api.userAuth, site.account);
	app.get('/settings/password', api.userAuth, site.password);


	app.get('/api/logout', api.logout);
	app.post('/api/login', api.login);


	app.get('/idea', site.idea);

	/**
	 * 404 Page
	 */
	app.get('*', function(req, res, next) {
		debugger
		if (/.*\.(gif|jpg|jpeg|png|bmp|js|css|html|eot|svg|ttf|woff|otf|ico).*$/.test(req.originalUrl)) {
			next();
		} else {
			res.render('404');
		}
	});


}