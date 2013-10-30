
module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', {
			title : "微糖"
		});
	});


	app.get('/test', function(req, res) {
		res.render('test', {
			title: "微糖"
		});
	});

}