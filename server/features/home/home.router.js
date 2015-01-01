var express = require('express');
var router = express.Router();

var homePath = "/";

router.get(homePath, function(req, res) {
	res.render('index',{build:"build/"});
});

router.get('/views/:viewName', function(req, res) {
	res.render('views/' + req.params.viewName);
});

module.exports = router;