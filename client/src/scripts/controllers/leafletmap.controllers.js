'use strict';

(function() {
	angular.module('notifire').controller('leafletmapCtrl', ['Map', '$scope', '$timeout', 'Notifications', MapController]);

	function MapController(Map, $scope, $timeout, Notifications) {
		var self = this;
		self.modalData={};

		function init() {
			Map.getMap().on('click', createNewNotification);
		}

		function createNewNotification(event) {
			Map.getMap().off('click', createNewNotification);
			$('#creationModal').modal({backdrop:'static',show:true});
			self.modalData.lat = event.latlng.lat;
			self.modalData.lon = event.latlng.lng;
			$scope.$apply();
		}

		self.saveNotification = function(modalData){
			Notifications.addNewNotification(modalData, $scope);
			self.modalData={};
			self.closeNotification();
		}

		self.closeNotification = function(){
			$timeout(function(){
				Map.getMap().on('click', createNewNotification);
				$('#creationModal').modal('hide');
			});
		}

		init();
	}
})();