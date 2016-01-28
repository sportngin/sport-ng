(function() {
'use strict'

angular.module('sport.ng')
.directive('datetimeFields', function() {
  return {
    replace: true,
    restrict: 'A',
    scope: {
      datetime: '=',
      timezone: '=',
      name: '=',
      translationKey: '=',
      timeFormat: '='
    },
    templateUrl: '/bower_components/sport-ng/datetimeFields/datetimeFields.html',
    controller: function($scope, moment) {
      $scope.dateObj = {}

      function formatDate(date, time) {
        if (!date) return null
        var formattedDate = $scope.timezone ? moment.tz(date, $scope.timezone) : moment(date)
        if(time) formattedDate.add(_.object(['hours', 'minutes'], time.split(':')))
        return moment(formattedDate).utc().format()
      }

      var formats = {
        '12': "h:mm a",
        '24': "HH:mm"
      }
      function setFormat(timeFormat) { $scope.printFormat = formats[timeFormat] }
      setFormat($scope.timeFormat)
      $scope.$watch('timeFormat', function (timeFormat) { setFormat(timeFormat) })

      $scope.$watch('dateObj.date', function (date) {
        if(typeof date === 'undefined') $scope.dateObj.time = undefined
      })

      $scope.$watch('datetime', function (datetime) {
        if (datetime){
          var timezone = $scope.timezone
          datetime = timezone ? moment.tz(datetime, timezone) : moment(datetime)
          $scope.dateObj.date = datetime.format('YYYY-MM-DD')
          $scope.dateObj.time = datetime.format('HH:mm')
        }
      })

      $scope.$watch('dateObj', function(bef, aft) {
        $scope.datetime = formatDate($scope.dateObj.date, $scope.dateObj.time)
      }, true)
    }
  }
})

})()
