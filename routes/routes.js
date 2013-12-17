var site = require('../controllers/site'),
	api = require('../controllers/api');

module.exports = function(app) {
	
	/**
	 * 页面路由
	 */
	app.get('/index', site.index);						// 跳转到【微糖首页】（登录）
	app.get('/', api.userAuth, site.home);				// 跳转到【微糖首页】
	app.get('/home', api.userAuth, site.home);			// 跳转到【微糖首页】
	app.get('/topic', api.userAuth, site.topic);		// 跳转到【话题】页面
	app.get('/explore', api.userAuth, site.explore);	// 跳转到【发现】页面
	app.get('/question', api.userAuth, site.question);	// 跳转到【具体问题】页面
	app.get('/ask', api.userAuth, site.ask);			// 跳转到【提问】页面
	app.get('/resetPassword', site.resetPassword);		// 跳转到【重置密码】页面
	app.get('/resetPassEmail', site.resetPassEmail);

	/**
	 * 用户相关路由
	 */
	app.post('/api/signup', api.signup);
	app.post('/api/login', api.login);
	app.get('/api/logout', api.logout);
	app.post('/api/resetPassword', api.resetPassword);
	app.post('/api/resetPassEmail', api.resetPassEmail);
	app.post('/api/modifyPassword', api.userAuth, api.modifyPassword);


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
	app.get('/chart', function(req, res) {
		res.render('chart');
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