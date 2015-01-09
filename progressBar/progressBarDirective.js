angular.module('sport.ng')
  .directive('progressBar', function progressBar(i18ng, PusherUtil) {

    var TIME_REMAINING = i18ng.t("TIME_REMAINING.remaining_placeholder")
    var timeRemainingTemplate = '<p ng-bind-html="timeRemaining"></p>'

    function getTimeRemaining(min, sec) {
      var parts = [
        i18ng.t("TIME_REMAINING.second", { count: sec }),
        i18ng.t("TIME_REMAINING.remaining")
      ]
      if (min) parts.unshift(i18ng.t("TIME_REMAINING.minute", { count: min }))
      return parts.join(' ')
    }

    return {
      scope: {
        promise: "="
      },
      replace: true,
      restrict: 'A',
      templateUrl: '/bower_components/sport-ng/progressBar/progressBar.html',
      link: function(scope, element, attrs) {

        var timeRemainingElement
        var total
        var completed

        scope.progressWidth = function() {
          return (total ? 100 * completed / total : 0) + '%'
        }

        scope._progress = function(data) {
          if (data.remaining_seconds) {
            var minutes = Math.floor(data.remaining_seconds / 60)
            var seconds = Math.round(data.remaining_seconds % 60)
            var timeRemainingText = getTimeRemaining(minutes, seconds)

            // For CSS reasons, we need the <p> to come after the progress bar element.
            // However, we can't have two base elements when using the directive replace
            // option (which we also need for CSS). So we insert it
            if (timeRemainingText) {
              if (!timeRemainingElement) {
                timeRemainingElement = angular.element('<p/>').insertAfter(element)
                element.on('$destroy', function(){ timeRemainingElement.remove() })
              }
              timeRemainingElement.text(timeRemainingText)
            }
          }

          total = parseFloat(data.total) || 0
          completed = parseFloat(data.completed) || 0
        }

        scope._errored = function(e) {
          console.log("The remote job errored:", e)
        }

        scope._completed = function() {
          scope.total = scope.total || 1
          scope.completed = scope.total
        }

        scope.$watch('promise', function(promise) {
          if (promise) promise.then(scope._completed, scope._errored, scope._progress)
        })


      }
    }

  })
