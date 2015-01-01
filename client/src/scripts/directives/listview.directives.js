'use strict';

(function() {
	angular.module('notifire').directive('listView', LeafletMap);

	function LeafletMap() {
		return {
				restrict: 'E',
				templateUrl:'views/listview',
				controller:"listviewCtrl as listviewCtrl",
				replace: true
		};
	}

	angular.module('notifire').directive('unpropogate', Unpropogate);

	function Unpropogate() {
		return {
				restrict: 'A',
       			link: function (scope, element, attrs) {
       				element.on('click',function(event){
						event.stopPropagation();
       				})
       			}
		};
	}
})();