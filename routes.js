
module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', {
			title : "微糖"
		});
	});


	app.get('/todo', function(req, res) {
		res.render('todo', {
			title: "我的TODO"
		});
	});


	app.get('/idea', function(req, res) {
		res.render('idea', {
			title: "头脑风暴"
		});
	});




	

}