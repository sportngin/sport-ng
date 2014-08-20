;(function() {
"use strict"

angular.module('sport.ng')
  .factory('moment', function($window) {
    var moment = $window.moment
    return moment
})

})();
