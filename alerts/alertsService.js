"use strict"

angular.module('sport.ng')
  .factory('Alerts', function($timeout) {
    var alerts = []

    function show(type, message, options, duration, dismissable) {
      // options is optional
      if (typeof options != 'object')
        duration = options, options = {}

      // duration is optional
      if (typeof duration != 'number')
        dismissable = duration, duration = null

      // dismissable is optional and defaults to true
      dismissable = dismissable !== false
      // duration defaults to 5 seconds
      duration = typeof duration != 'number' ? 5000 : duration

      var alert = {
        type: type,
        message: message,
        options: options,
        dismissable: dismissable
      }

      // never hide with a duration of 0 or less
      if (duration > 0)
        alert._timer = $timeout(remove.bind(null, alert), duration)

      alerts.push(alert)
    }

    function remove(alert) {
      $timeout.cancel(alert._timer)
      var idx = alerts.indexOf(alert)
      if (idx > -1) alerts.splice(idx, 1)
    }

    return {
      alerts: alerts,
      show: show,
      info: show.bind(this, 'info'),
      success: show.bind(this, 'success'),
      error: show.bind(this, 'error'),
      warning: show.bind(this, 'warning'),
      remove: remove
    }
  })
  .directive('alerts', function alertsDirective(Alerts) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/components/alerts/alerts.html',

      controller: function alertsDirectiveCtrl($scope) {
        $scope.alerts = Alerts.alerts
        $scope.close = function(alert) {
          Alerts.remove(alert)
        }
      }
    }
  })
