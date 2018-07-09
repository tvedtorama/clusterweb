require('dotenv').config()

// require("babel-core/register");
// require("babel-polyfill");
var express = require('express')
var exphbs = require('express-handlebars')
var cookieParser = require('cookie-parser')
var favicon = require('serve-favicon')
var path = require('path')
var fs = require('fs')

var app = express()

const serverApp = process.env["serverApp"] || "coreApi"

app.disable('x-powered-by');
const viewsRootPath = fs.existsSync(path.join(__dirname, '/views')) ? path.join(__dirname, '/views') : path.join(__dirname, `/${serverApp}/views`)
app.engine('handlebars', exphbs({ 
	defaultLayout: 'main',
	layoutsDir: path.join(viewsRootPath, `/layouts`),
	partialsDir: viewsRootPath,
}))
app.set('view engine', 'handlebars')
app.set('views', viewsRootPath);
app.use(cookieParser())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

if (process.argv.filter(function(x) {return x === "webpack"}).length > 0) {
	var config = require('./webpack.config')(process.env);
	var webpack = require('webpack');
	var webpackMiddleware = require("webpack-dev-middleware");

	var compiler = webpack(config)

	app.use(webpackMiddleware(compiler, {
		publicPath: config.output.publicPath,
		hot: true,
		historyApiFallback: true,
	}))

	app.use(require("webpack-hot-middleware")(compiler));
}

const main = require(`./build/${serverApp}/main`)

main.default(app)

const port = parseInt(process.env["port"] || "3000")

app.listen(port, function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log(`Listening at http://*:${port}/`);
});
