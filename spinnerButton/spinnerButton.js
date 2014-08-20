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
    transclude: true,
    template: '<div ng-transclude></div><span class="spinner"></span>',
    link: function(scope, elem, attrs) {
      var spinningBool
      var spinningFn
      var oldProp
      var oldAttr

      if ('spinning' in attrs) spinningFn = $parse(attrs.spinning)

      function spinningValue() { return spinningFn && spinningFn(scope) || spinningBool }

      scope.$watch(spinningValue, function(spinning) {
        elem.toggleClass('spinning', !!spinning)
        if (spinning) {
          oldProp = elem.prop('disabled')
          oldAttr = elem.attr('disabled')
          elem.attr('disabled', true)
        }
        else {
          if (!oldAttr) elem.removeAttr('disabled')
          if (!oldProp) elem.removeProp('disabled')
        }
      })

      // This will return a noop method if spinnerClick isn't set
      var clickFn = $parse(attrs.spinnerClick)
      elem.on('click', function(event) {
        scope.$apply(function() {
          var clickPromise = clickFn(scope, { $event: event })
          if (clickPromise && clickPromise.finally) {
            spinningBool = true
            clickPromise.finally(function(){ spinningBool = false })
          }
        })
      })
    }
  }
})

})();
