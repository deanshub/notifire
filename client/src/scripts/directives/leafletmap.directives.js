'use strict';

(function() {
	angular.module('notifire').directive('leafletMap', LeafletMap);

	function LeafletMap() {
		return {
				restrict: 'E',
				templateUrl:'views/leafletMap',
				controller:"leafletmapCtrl as leafletmapCtrl",
				replace: true
		};
	}

	angular.module('notifire').directive('creationModal', CreationModal);

	function CreationModal() {
		return {
				restrict: 'E',
				templateUrl:'views/creationModal',
				replace: true
		};
	}

})();
