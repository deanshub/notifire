'use strict';

(function() {
angular.module('notifire').service('Map', ['RemoteNotifications', Map]);

function Map(RemoteNotifications) {
    var self = this;

    var map;

    function init(){
        map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    }

    self.addMarker = function(notification) {
        if (notification.lat && notification.lon){
            var marker = L.marker([notification.lat,notification.lon]).addTo(map);
            return marker;
        }
        return null;
    }

    self.getMap = function(){
        return map;
    }

    init();
}
})();