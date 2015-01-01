'use strict';
(function() {

var Config = {
	serverUrl: 'http://' + window.location.hostname + ':8131/'
};

angular.module('notifire').constant('Config', Config);

})();