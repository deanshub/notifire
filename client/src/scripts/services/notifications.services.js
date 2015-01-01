'use strict';

(function() {
angular.module('notifire').service('Notifications', ['$resource', '$filter', 'RemoteNotifications', 'Map', Notifications]);

function Notifications($resource, $filter, RemoteNotifications, Map) {
    var self = this;

    var notifications=[];
    var allNotifications=[];
    var lastUpdated = new Date();
    var timeLimit = 2 * 60 * 1000;

    function init(){
    }

    function shalowCopy(notifications){
        var copy=[];
        for (var index = 0; index < notifications.length; index++) {
            var notificationsCopy = {};
            for (var prop in notifications[index]){
                if (notifications[index].hasOwnProperty(prop) && prop!='marker')
                    notificationsCopy[prop] = notifications[index][prop];
            }
            copy.push(notificationsCopy);
        }
        return copy;
    }

    self.localReloadNotificatoins = function($scope){
        allNotifications = localStorage.getItem('notifications');
        if (allNotifications){
            allNotifications = JSON.parse(allNotifications);
            allNotifications.forEach(function(notification){
                notification.marker = Map.addMarker(notification);
                if (notification.marker){
                    (function(notification){
                        notification.marker.on('click',function(){
                            notification.selected=true;
                            $scope.$apply();
                        });
                    })(notification);
                }
            })
        }else{
            allNotifications = [];
        }

        lastUpdated = localStorage.getItem('lastUpdated');
        if (lastUpdated){
            lastUpdated = new Date(lastUpdated);
        }
    }

    self.getTimeLimit = function(){
        return timeLimit;
    }

    self.getLastUpdated = function(){
        return lastUpdated;
    }

    self.resetLocalNotifications = function(resetDate){
        localStorage.setItem('notifications',JSON.stringify(shalowCopy(allNotifications)));
        if (resetDate){
            localStorage.setItem('lastUpdated', lastUpdated.toJSON());
        }
    }

    self.getRemoteUpdates = function($scope) {
        var updateRequestTime = new Date();
        RemoteNotifications.getUpdates({since:lastUpdated.toJSON()}, function(arrNotifications){
            lastUpdated = updateRequestTime;
            for (var index = 0; index < arrNotifications.length; index++) {
                var notification = arrNotifications[index];

                if (notification.is_active){
                    notification.marker = Map.addMarker(notification);
                    if (notification.marker){
                        (function(notification){
                            notification.marker.on('click',function(){
                                notification.selected=true;
                                $scope.$apply();
                            });
                        })(notification);
                    }

                    for (var index3 = 0; index3 < allNotifications.length; index3++) {
                        if (allNotifications[index3].id == notification.id){
                            allNotifications.splice(index3,1);
                            break;
                        }
                    }

                    allNotifications.push(notification);
                }else{
                    for (var index2 = 0; index2 < allNotifications.length; index2++) {
                        if (allNotifications[index2].id == notification.id){
                            allNotifications.splice(index2,1);
                            Map.getMap().removeLayer(allNotifications[index2].marker);
                            break;
                        }
                    }
                }
            }
            self.resetLocalNotifications(true);
        });
    }

    self.remoteReloadNotifications = function($scope){
        RemoteNotifications.query({},function(arrNotifications){
            lastUpdated = new Date();
            
            for (var index = 0; index < arrNotifications.length; index++) {
                var notification = arrNotifications[index];
                if (notification.is_active){
                    notification.marker = Map.addMarker(notification);
                    if (notification.marker){
                        (function(notification){
                            notification.marker.on('click',function(){
                                notification.selected=true;
                                $scope.$apply();
                            });
                        })(notification);
                    }
                    allNotifications.push(notification);
                }
            }

            self.resetLocalNotifications(true);
        });
    }

    function distanceFromCenter(notification){
        var center = Map.getMap().getCenter();
        return Math.sqrt( Math.pow((notification.lat - center.lat),2) + Math.pow((notification.lon - center.lng),2) );
    }

    function lastInbound(notifications){
        var bounds = Map.getMap().getBounds();
        var index = -1;
        var inBounds = true;


        while (inBounds){
            index++;
            inBounds = index < notifications.length;
            if (inBounds){
                var latlng = L.latLng(notifications[index].lat, notifications[index].lon);
                inBounds = bounds.contains(latlng, latlng);
            }
        }

        return index;
    }

    self.reorderNotifications = function(){
        var orderBy = $filter('orderBy');
        allNotifications = orderBy(allNotifications, distanceFromCenter);
    }

    self.relimitNotifications = function(){
        if (allNotifications){
            var limitTo = $filter('limitTo');
            notifications = limitTo(allNotifications, lastInbound(allNotifications));
        }
    }

    self.addNewNotification = function(notificationData) {
        var newNotification = new RemoteNotifications({notification:notificationData})
        newNotification.$save(function(persistentNotification){
            persistentNotification.marker = Map.addMarker(persistentNotification);
            if (persistentNotification.marker){
                persistentNotification.marker.on('click',function(){
                    persistentNotification.selected=true;
                });
            }
            
            allNotifications.push(persistentNotification);
            self.reorderNotifications();
            self.relimitNotifications();
            self.resetLocalNotifications(false);
        });

    };

    self.getAllNotificationCount = function(){
        if (allNotifications)
            return allNotifications.length;
        else
            return 0;
    }

    self.getNotificationCount = function(){
        return notifications.length;
    }

    self.getAllNotification = function(){
        return allNotifications;
    }

    self.getNotifications = function(){
        return notifications;
    }

    self.deleteNotification = function(notification){
        RemoteNotifications.delete({id:notification.id},function(){
            Map.getMap().removeLayer(notification.marker);
            allNotifications.splice(allNotifications.indexOf(notification),1);
            self.resetLocalNotifications(false);
            self.relimitNotifications();
        });
    }

    self.updateNotification = function(notification){
        RemoteNotifications.update({id:notification.id},{notification:shalowCopy([notification])[0]},function(persistentNotification){
            notification.title = persistentNotification.title;
            notification.description = persistentNotification.description;
            notification.editable = false;
            self.resetLocalNotifications(false);
        });
    }

    init();
}
})();