"use strict";

angular.module('sport.ng')
  .factory('_', function($window) {
    var _ = $window._
    // $window._ = null
    return _
  })
