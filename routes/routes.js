var site = require('../controllers/site'),
	api = require('../controllers/api');

module.exports = function(app) {
	
	/**
	 * 页面路由
	 */
	app.get('/index', site.index);
	app.get('/', api.userAuth, site.home);
	app.get('/home', api.userAuth, site.home);
	app.get('/topic', api.userAuth, site.topic);
	app.get('/explore', api.userAuth, site.explore);
	app.get('/question', api.userAuth, site.question);
	app.get('/ask', api.userAuth, site.ask);
	app.get('/resetPassword', site.resetPassword);
	app.post('/resetPassword', function(req, res) {
		res.json({
			r: 0
		});
	})

	/**
	 * 用户相关路由
	 */
	app.post('/api/signup', api.signup);
	app.post('/api/login', api.login);
	app.get('/api/logout', api.logout);

	/**
	 * 设置相关路由
	 */
	app.get('/settings/*', api.userAuth);
	app.get('/settings/account', site.account);
	app.get('/settings/password', site.password);

	/**
	 * 问题相关路由
	 */
	app.get('/api/question/*', api.userAuth);	// 问题相关操作都要添加用户认证
	app.post('/api/question/addQuestion', api.addQuestion);				// 添加一个问题
	app.get('/api/question/findQuestionById', api.findQuestionById);	// GET方式，通过_id来查找某个问题
	app.post('/api/question/findQuestionById', api.findQuestionById);	// POST方法，通过_id来查找某个问题
	app.get('/api/question/findQuestionsByPage', api.findQuestionsByPage);  // GET方式，分页查找问题
	app.post('/api/question/findQuestionsByPage', api.findQuestionsByPage); // POST方式，分页查找问题
	app.get('/api/question/searchQuestionsByTitle', api.searchQuestionsByTitle); // 通过问题标题关键字搜索问题
	app.get('/api/question/searchQuestionsByContent', api.searchQuestionsByContent); // 通过问题内容关键字搜索问题

	app.get('/idea', site.idea);
	app.get('/epic', function(req, res) {
		res.render('epic');
	});
	app.get('/test', function(req, res) {
		res.render('test');
	});

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