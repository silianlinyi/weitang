
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

	app.get('/test2', function(req, res) {
		res.render('test2', {
			title: "微糖"
		});
	});

	app.get('/divider', function(req, res) {
		res.render('divider', {
			title: "Divider"
		});
	});

	app.get('/header', function(req, res) {
		res.render('header', {
			title: "header"
		});
	});

	app.get('/icon', function(req,res) {
		res.render('icon', {
			title: "icon"
		});
	});



	

}