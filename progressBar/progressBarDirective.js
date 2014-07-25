angular.module('sport.ng')
  .directive('progressBar', function progressBar(i18ng) {

    var timeRemainingPlaceholder = i18ng.t("TIME_REMAINING.remaining_placeholder")

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
        remoteJob: "=",
        remoteJobName: "@",
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

        scope._pusherProgress = function(scope, pusherData) {
          var minutes = Math.floor(pusherData.remaining_seconds / 60)
          var seconds = Math.round(pusherData.remaining_seconds % 60)
          var remainingText = timeRemaining(minutes, seconds)
          scope.total = pusherData.total
          scope.completed = pusherData.completed
          scope.timeRemaining = remainingText
        }

        scope._pusherErrored = function() {
          scope.errorMessage = scope._errorMessage || "An unexpected error occured."
        }

        scope._completed = function() {
          scope.total = scope.total || 1
          scope.completed = scope.total
        }

        // setup pusher connection if `remoteJob` key provided
        // or find/create channel from `remoteJobName` string key
        var channel = scope.remoteJob
        var channelName = scope.remoteJobName
        if (!channel && channelName) channel = Pusher.channel(channelName) || Pusher.subscribe(channelName)
        
        if (channel) {
          scope.timeRemaining = timeRemainingPlaceholder
          scope.channel = channel
          channel.bind('progress', scope._pusherProgress)
          channel.bind('error', scope._pusherErrored)
          channel.bind('completed', scope._completed)
        }

      }
    }

  })
