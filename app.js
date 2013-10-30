
/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	config = require('./config'),
	routes = require('./routes');

// 数据库连接
mongoose.connect('mongodb://' + config.MONGODB_IP + '/' + config.MONGODB_DATABASE_NAME, function(err) {
	if(!err) {
		console.log('【日志】连接到数据库：' + config.MONGODB_DATABASE_NAME);
	} else {
		throw err;
	}
});

var app = express();
// 修改文件后缀
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// all environments
app.set('port', process.env.PORT || config.WEB_SERVER_PORT);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// 路由
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
