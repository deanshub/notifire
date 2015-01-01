var request = require('request');
var express = require('express');
var router = express.Router();
var rootWazeApiUrl = "http://test-notifications.staging.waze.com";
var notificationsPath = "/notifications";
var jsonSuffix = ".json";


//////////////////////   GET method   ///////////////////////
router.get(notificationsPath + jsonSuffix, function(req, res) {
	req.pipe(request(rootWazeApiUrl + notificationsPath + jsonSuffix)).pipe(res);
});

router.get(notificationsPath + '/:id' + jsonSuffix, function(req, res) {
	req.pipe(request(rootWazeApiUrl + notificationsPath + "/" + req.params.id + jsonSuffix)).pipe(res);
});

router.get(notificationsPath + '/updates' + jsonSuffix, function(req, res) {
	var url = rootWazeApiUrl + notificationsPath + "/updates" + jsonSuffix;
	if (req.query.scince){
		url+="?since="+req.query.scince;
	}

	req.pipe(request(url)).pipe(res);
});

//////////////////////   POST method   ///////////////////////
router.post(notificationsPath + jsonSuffix, function(req, res) {
	req.pipe(request.post(rootWazeApiUrl + notificationsPath + jsonSuffix,{form:req.body})).pipe(res);
});

//////////////////////   PUT method   ///////////////////////
router.put(notificationsPath + '/:id' + jsonSuffix, function (req, res) {
	req.pipe(request.put(rootWazeApiUrl + notificationsPath + "/" + req.params.id + jsonSuffix, {form: req.body})).pipe(res);
});

router.put(notificationsPath + '/:id/upvote' + jsonSuffix, function (req, res) {
	req.pipe(request.put(rootWazeApiUrl + notificationsPath + "/" + req.params.id + "/upvote" + jsonSuffix, {form: req.body})).pipe(res);
});

//////////////////////   DELETE method   ///////////////////////
router.delete(notificationsPath + '/:id' + jsonSuffix, function (req, res) {
	req.pipe(request.del(rootWazeApiUrl + notificationsPath + "/" + req.params.id + jsonSuffix)).pipe(res);
});

module.exports = router;