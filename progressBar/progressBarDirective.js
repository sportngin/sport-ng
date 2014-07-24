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

        scope._progress = function(scope, pusherData) {
          var minutes = Math.floor(pusherData.remaining_seconds / 60)
          var seconds = Math.round(pusherData.remaining_seconds % 60)
          var remainingText = timeRemaining(minutes, seconds)
          scope.total = pusherData.total
          scope.completed = pusherData.completed
          scope.timeRemaining = remainingText
        }

        scope._errored = function() {
          scope.errorMessage = scope._errorMessage || "An unexpected error occured."
        }

        scope._completed = function() {
          scope.total = scope.total || 1
          scope.completed = scope.total
          // kill the directive/element after the job is done and the CSS animation is done
          if (attrs.closeWhenComplete) _.delay(function(){ scope.$destroy() }, 500) 
        }

        scope.$watch('remoteJob', function(newVal, oldVal){
          console.log("remoteJob changed", newVal, oldVal)
        })

        // setup pusher connection if `remoteJob` key provided -- find/create channel from string key
        var channel = scope.remoteJob
        if (typeof channel === 'string') channel = scope.remoteJob = Pusher.channel(channel) || Pusher.subscribe(channel)
          console.log("directive sets scope: ", scope.remoteJob)
        if (channel) {
          channel.bind('progress', scope._progress)
          channel.bind('error', scope._errored)
          channel.bind('completed', scope._completed)
        }


      }
    }

  })
