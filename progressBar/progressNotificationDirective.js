angular.module('sport.ng')
  .directive('progressNotification', function progressNotification(i18ng) {

    var NOTIFICATION_CLASSES = 'info help error roadblock warning conflict success'

    return {
      scope: {
        title: "@",
        percent: "@",
        total: "@",
        completed: "@",
        remoteJob: "=",
        remoteJobName: "@"
      },
      replace: true,
      restrict: 'A',
      templateUrl: '/bower_components/sport-ng/progressBar/progressNotification.html',
      link: function(scope, element, attrs) {

        scope.close = function() {
          scope.$destroy()
        }

        // setup pusher connection if `remoteJob` key provided
        // or find/create channel from `remoteJobName` string key
        var channel = scope.remoteJob
        var channelName = scope.remoteJobName
        if (!channel && channelName) channel = Pusher.channel(channelName) || Pusher.subscribe(channelName)
        
        if (!channel) return

        scope.channel = channel
        channel.bind('completed', function() {
          _.delay(function(){
            element.removeClass(NOTIFICATION_CLASSES).addClass('success')
          }, 500) // wait for css animation
        })
        channel.bind('errored', function() {
          element.removeClass(NOTIFICATION_CLASSES).addClass('error')
        })
      }
    }

  })
