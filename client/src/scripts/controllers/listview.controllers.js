'use strict';

(function() {
angular.module('notifire').controller('listviewCtrl', ['$scope', 'Map', 'Notifications', 'RemoteNotifications', ListviewController]);

function ListviewController($scope, Map, Notifications, RemoteNotifications) {
	var self = this;

	function init() {
		Notifications.localReloadNotificatoins($scope);
		var lastUpdated = Notifications.getLastUpdated();

		if (lastUpdated){
			if ((new Date() - lastUpdated) > Notifications.getTimeLimit()){
				Notifications.getRemoteUpdates($scope);
			}
		}else {
			Notifications.remoteReloadNotifications($scope);
		}

		Notifications.reorderNotifications();
		Notifications.relimitNotifications();
		
		Map.getMap().on('dragend',function(){
			Notifications.reorderNotifications();
			Notifications.relimitNotifications();
			$scope.$apply();
		});

		Map.getMap().on('zoomend',function(){
			Notifications.reorderNotifications();
			Notifications.relimitNotifications();
			$scope.$apply();
		});
	}

	self.getNotificationCount = function(){
		return Notifications.getNotificationCount();
	}

	self.getAllNotification = function(){
		return Notifications.getAllNotification();
	}

	self.getAllNotificationCount = function(){
		return Notifications.getAllNotificationCount();
	}

	self.getNotifications = function(){
		return Notifications.getNotifications();
	}

	self.voteUp = function(notification){
		RemoteNotifications.upvote({id:notification.id},function(persistentNotification){
			notification.votes_up = persistentNotification.votes_up;
			Notifications.resetLocalNotifications(false);
		});
	}

	self.deleteNotification = function(notification){
		Map.getMap().removeLayer(notification.marker);
		Notifications.deleteNotification(notification);
	}

	self.editNotification = function(notification){
		notification.editable = true;
		notification.oldTitle = notification.title;
		notification.oldDescription = notification.description;
	}

	self.cancelEditNotification = function(notification){
		notification.title = notification.oldTitle;
		notification.description = notification.oldDescription;
		delete(notification.oldTitle);
		delete(notification.oldDescription);
		notification.editable = false;
	}

	self.saveEditNotification = function(notification){
		delete(notification.oldTitle);
		delete(notification.oldDescription);
		Notifications.updateNotification(notification);
	}

	
	init();
}
})();