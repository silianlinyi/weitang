var site = require('./controllers/site'),
	api = require('./controllers/api');

module.exports = function(app) {

	app.get('/', api.userAuth, site.index);

	app.get('/signin', site.signin);
	app.get('/settings', site.settings);

	app.get('/todo', function(req, res) {
		res.render('todo', {
			title: "我的TODO"
		});
	});


	app.get('/api/logout', api.logout);
	app.post('/api/login', api.login);




	

	app.get('/idea', site.idea);

	/**
	 * 404 Page
	 */
	app.get('*', function(req, res, next) {
		debugger
		if(/.*\.(gif|jpg|jpeg|png|bmp|js|css|html|eot|svg|ttf|woff|otf|ico).*$/.test(req.originalUrl)) {
			next();
		} else {
			res.render('404');
		}
	});


	

}