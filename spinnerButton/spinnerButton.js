;(function() {

'use strict'

/*
 * spinner-button directive
 *
 * It handles creation of the spinner container and allows
 * control of the spinner.
 *
 * class='spinning' will be automatically handled for you if the
 * click handler returns a promise and you use spinner-click=""
 * (instead of ng-click)
 *
 * Spinner can also be controlled manually via spinning=""
 */

angular.module('sport.ng')
.directive('spinnerButton', function($parse) {
  return {
    restrict: 'AE',
    //replace: true,
    transclude: true,
    //template: '<button ng-class="{ spinning: spinning }"><div ng-transclude></div><span class="spinner"></span></button>',
    template: '<div ng-transclude></div><span class="spinner"></span>',
    link: function(scope, elem, attrs) {
      var spinning
      var getSpinning
      if (attrs.spinning !== undefined) {
        getSpinning = $parse(attrs.spinning)
      }
      scope.$watch(function() {
        if (getSpinning) {
          return getSpinning(scope) || spinning
        }
        return spinning
      }, function(spinning) {
        if (spinning) elem.addClass('spinning')
        else elem.removeClass('spinning')
      })

      var spinnerClick = $parse(attrs.spinnerClick)
      elem.on('click', function(event) {
        scope.$apply(function() {
          var clickResult = spinnerClick(scope, { $event: event })
          if (clickResult && clickResult.then) {
            spinning = true
            var clearSpinning = function() { spinning = false }
            clickResult.then(clearSpinning, clearSpinning)
          }
        })
      })
    }
  }
})

})();
