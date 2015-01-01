'use strict';

(function() {
angular.module('notifire').filter('counter', Counter);

function Counter() {
    return function(input, showing, all) {
        if (showing==all){
            return "Showing all notifications";
        }else if (showing==0){
            return "There are no notifications in display";
        }else{
            return "Showing " + showing + " out of " + all + " notifications";
        }
    };
}
})();