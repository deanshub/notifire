'use strict';
var notifire = angular.module('notifire',[
	'ngRoute',
	'ngResource'
]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/',{
		controller:'homeCtrl',
		templateUrl: 'views/home'
	})
	.otherwise({redirectTo:'/'});

	$locationProvider.html5Mode(true);
}]);