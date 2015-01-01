'use strict';

(function() {
angular.module('notifire').factory('RemoteNotifications', ['$resource', 'Config', RemoteNotifications]);

var notificationsPath='notifications';
var jsonSuffix=".json";

function RemoteNotifications($resource, Config) {
    return $resource(Config.serverUrl + notificationsPath + "/:id" + jsonSuffix, {id: "@id"},{
        update:{
            method:'put'
        },
        upvote:{
            method:'put',
            url:Config.serverUrl + notificationsPath +'/:id/upvote' + jsonSuffix,
            params:{id: '@id'}
        },
        getUpdates:{
            method:'get',
            url:Config.serverUrl + notificationsPath + '/updates' + jsonSuffix + '?since=:since',
            params:{since: '@since'},
            isArray:true
        }
    });
}
})();