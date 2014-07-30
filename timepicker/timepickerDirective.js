/*
Timepicker directive

Usage:

  The timepicker directive should be used whereever a timepicker input
  be displayed:

    <timepicker time="ctrl.eventTime"></timepicker>

time attribute:
  The time attribute is required and takes the place of ng-model
  must be a string in the 00:00 form.

allowtbd attribute:
  The allowtbd attribute is not required and denotes whether a blank time will be converted to 'TBD' or rejected
  set to `false` by default
  must be a boolean

hour12 attribute:
  The hour2 attribute is not required and denotes whether 12 or 24 hour format is used
  set to `true` by default
  must be a boolean

print attribute:
  The print attribute is not required and is a function that converts a time string value to a date
  set to local function be default
  must be a function accepting the following parameters: time (string), hour12 (boolean), allowTBD (boolean)

parse attribute:
  This parse attribute is not required and is a function that converts an entered string into a time string
  set to local function by default
  must be a function accepting the following parameters: val (string), allowTBD (boolean)

*/

;(function() {
'use strict'

var print = function(time, hour12, allowTBD) {
  if (!time || !time.valueOf || !time.valueOf()){
    if (allowTBD) return 'TBD'
    return ''
  }
  if (hour12) return print12(time)
  return time
}

function print12(time) {
  time = time.split(':')
  var hour = parseInt(time[0])
  var period = Math.floor(hour / 12) % 2 == 0 ? 'am' : 'pm'
  hour = hour % 12
  if (hour == 0) hour = 12
  return hour + ':' + time[1] + ' ' + period
}

var parse = function(val, allowTBD) {
  var whitespaceOnly = !val.match(/\S/) //still a usefull function?
  if (allowTBD && (whitespaceOnly || val.toUpperCase() == 'TBD')) {
    return ''
  } else if (whitespaceOnly) {
    return null
  }

  var pm = false
  if (val.match(/pm/i)) pm = true //should I use `pm` or just `p` ?
  var time = val.replace(/[^\d]/g, '').split(':')

  var hour
  var minute
  
  if (time.length !== 2) {
    var withoutColon = time[0]
    //the switch statement is from the original code. Should I rewrite it?
    switch (withoutColon.length) {

      case 1:
      case 2:
        hour = parseInt(withoutColon)
        minute = 0
        break

      case 3:
        hour = parseInt(withoutColon.substring(0,1))
        minute = parseInt(withoutColon.substring(1))
        break

      default:
        hour = parseInt(withoutColon.substring(0,2)) || 0
        minute = parseInt(withoutColon.substring(2,4)) || 0
    }
  }

  // otherwise, convert to numbers
  else {
    hour = parseInt(time[0])
    minute = parseInt(time[1])
  }

  hour += Math.floor(minute / 60)
  minute %= 60

  if (pm) hour += 12
  hour %= 24
  if (hour == 0 || hour == 12) hour += 12
  hour %= 24

  return twoDigit(hour) + ':' + twoDigit(minute)

}

function twoDigit(x){
  x = x.toString()
  x = '00' + x
  return x.substring(x.length-2)
}

var defaults = {
  allowtbd: false,
  hour12: true,
  print: print,
  parse: parse
}


angular.module('sport.ng')
  .directive('timepicker', function(_) {
    return {
      restrict: 'A',
      scope: {
        time: '=',
        allowtbd: '=',
        hour12: '=',
        print: '=',
        parse: '=' //never used in sport admin or venue admin. Should I keep it?
      },
      templateUrl: '/bower_components/sport-ng/timepicker/timepicker.html',
      link: function(scope, element, attrs) {
        // transfer some of the attributes to the input, removing them from the timepicker element
        var attributes = _.pick(attrs, ['id', 'name', 'tabindex'])
        _.each(attributes, function(val, name) { element.removeAttr(name) })
        element.find('input').attr(attributes)
        if (attrs['class']) element.find('input').addClass(attrs['class'].replace(/ng-[^\s]+/g, ''))
      },
      controller: function($scope, moment) {
        var opts = {}

        _.extend(opts, _.defaults(_.pick($scope, ['allowtbd', 'hour12', 'print', 'parse']), defaults))

        $scope.displayTime = opts.print($scope.time, opts.hour12, opts.allowtbd)

        $scope.updateTime = function(){
          var newTime = opts.parse($scope.displayTime, opts.allowtbd)
          $scope.time = (newTime === null) ? $scope.time : newTime
          $scope.displayTime = opts.print($scope.time, opts.hour12, opts.allowtbd)
        }



        // function compactTime(date) {
        //   return date.format('h:mma').replace(/m$/i, '')
        // }

        // function atTime(date) {
        //   return ' @ ' + compactTime(date)
        // }

        // var formats = {
        //   abbrevDateTime: function(date) {
        //     var res = date.format('ddd MMM D').toUpperCase()
        //     if (!$scope.tbdTime) res += atTime(date)
        //     return res
        //   }
        // }

        // function updateFormatted() {
        //   var date = moment($scope.date)
        //   if ($scope.tz) date = date.tz($scope.tz)

        //   var format = formats[$scope.format] || $scope.format || 'lll'
        //   if (angular.isFunction(format) ) {
        //     $scope.formatted = format(date)
        //   } else {
        //     $scope.formatted = date.format(format)
        //   }
        // }

        //$scope.$watch('date', updateFormatted)
        //$scope.$watch('format', updateFormatted)
        //$scope.$watch('tz', updateFormatted)






      }
    }
  })

}())
