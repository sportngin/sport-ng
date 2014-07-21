angular.module('sport.ng')
  .directive('progressBar', function progressBar(i18ng) {

    function timeRemaining(min, sec) {
      var parts = [
        i18ng.t("TIME_REMAINING.second", { count: sec }),
        i18ng.t("TIME_REMAINING.remaining")
      ]
      if (min) parts.unshift(i18ng.t("TIME_REMAINING.minute", { count: min }))
      return parts.join(' ')
    }

    function progress(scope, pusherData) {
      var minutes = Math.floor(pusherData.remaining_seconds / 60)
      var seconds = Math.round(pusherData.remaining_seconds % 60)
      var remainingText = timeRemaining(minutes, seconds)
      scope.total = pusherData.total
      scope.completed = pusherData.completed
      scope.timeRemaining = remainingText
    }

    function errored(scope) {
      scope.errorMessage = scope._errorMessage || "An unexpected error occured."
    }

    function completed(scope) {
      scope.total = scope.total || 1
      scope.completed = scope.total
    }

    function destroyWhenCompleted(scope){
      completed(scope)
      // kill the directive/element after the job is done and the CSS animation is done
      _.delay(function(){ scope.$destroy() }, 500) 
    }

    return {
      scope: {
        percent: "@",
        total: "@",
        completed: "@",
        remoteJob: "@",
        _remoteError: '@remoteError' // will replace `scope.remoteError` if error event occurs
      },
      restrict: 'A',
      templateUrl: '/bower_components/sport-ng/progressBar/progressBar.html',
      link: function(scope, element, attrs) {
        scope.progress = function() {
          var percent = parseFloat(scope.percent)
          if (isNaN(percent)) {
            var completed = parseFloat(scope.completed) || 0
            var total = parseFloat(scope.total) || 0
            percent = total ? 100 * completed / total : 0
          }
          return percent
        }

        // setup pusher connection if `remoteJob` key provided
        var channel = scope.remoteJob
        if (channel) {
          // find/create channel from string key
          if (typeof channel === 'string') channel = Pusher.channel(channel) || Pusher.subscribe(channel)
          // close when complete if flagged to do so
          var completedMethod = attrs.closeWhenComplete ? destroyWhenCompleted : completed
          channel.bind('progress', progress.bind(null, scope))
          channel.bind('error', errored.bind(null, scope))
          channel.bind('completed', completedMethod.bind(null, scope))
        }
      }
    }

  })
