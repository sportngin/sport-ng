angular.module('sport.ng')
  .directive('progressNotification', function progressNotification(i18ng) {

    var defaultTimeRemaining = i18ng.t("TIME_REMAINING.remaining_placeholder")

    return {
      scope: {
        title: "@",
        percent: "@",
        total: "@",
        completed: "@"
      },
      restrict: 'A',
      templateUrl: '/bower_components/sport-ng/progressBar/progressNotification.html',
      link: function(scope, element, attrs) {
        scope.timeRemaining = function() {
          return defaultTimeRemaining
        }
      }
    }

  })
