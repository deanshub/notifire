var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var app = express();

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
}

app.use(express.static(__dirname + '\\..\\client\\build'));
app.engine('.ejs', ejs.renderFile);
app.set('views', __dirname + '/../client/build');
app.set('view engine', 'ejs');
app.use(allowCrossDomain);
app.use(bodyParser.json());

var config = require('./config');
var routesManager = require('./common/routesManager')(app);

routesManager.registerRouters();

app.listen(config.server.port);

console.log('Server started on port %d', config.server.port);
