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

displayformat attribute:
  The displayformat attribute is not required and is a function that converts a time string value to a date
  set to local function be default
  must be a function accepting the following parameters: time (string), hour12 (boolean), allowTBD (boolean)

stringtotime attribute:
  This stringtotime attribute is not required and is a function that converts an entered string into a time string
  set to local function by default
  must be a function accepting the following parameters: val (string), allowTBD (boolean)

*/

;(function() {
'use strict'

var displayFormat = function(time, hour12, allowTBD) {
  if (!time || !time.valueOf || !time.valueOf()){
    if (allowTBD) return 'TBD'
    return ''
  }
  if (hour12) return displayFormat12(time)
  return time
}

function displayFormat12(time) {
  time = time.split(':')
  var hour = parseInt(time[0])
  var period = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  if (hour == 0) hour = 12
  return hour + ':' + time[1] + ' ' + period
}

var stringToTime = function(val, allowTBD) {
  var whitespaceOnly = !val.match(/\S/) //still a usefull function?
  if (allowTBD && (whitespaceOnly || val.toUpperCase() == 'TBD')) {
    return ''
  } else if (whitespaceOnly) { //evaluate utility
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
        hour = parseInt(v)
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
    //should I add the line below back in? I think the other way would be best
    //if (val[1].length === 1) minute *= 10 // one digit minutes (12:3) >> (12:30)
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
  allowtbd: false, //still useful function?
  hour12: true,
  displayFormat: displayFormat,
  stringToTime: stringToTime
}


angular.module('sport.ng')
  .directive('timepicker', function(_) {
    return {
      restrict: 'A',
      scope: { //should defaults be put here?
        time: '=',
        allowtbd: '=', //never used in either sport admin or venue admin. Shoud I keep it?
        hour12: '=',
        displayformat: '&',
        stringtotime: '&' //never used in sport admin or venue admin. Should I keep it?
      },
      templateUrl: '/bower_components/sport-ng/timepicker/timepicker.html',
      link: function(scope, element, attrs) {
        // transfer some of the attributes to the input, removing them from the timepicker element
        var attributes = _.pick(attrs, ['id', 'name', 'tabindex'])
        _.each(attributes, function(val, name) { element.removeAttr(name) })
        element.find('input').attr(attributes)
        if (attrs['class']) element.find('input').addClass(attrs['class'].replace(/ng-[^\s]+/g, ''))

        var opts = {}

        scope.element = element

        //is there an easier way to do the following two lines with _.defaults or _.extend or such? I don't think so....
        opts.displayFormat = attrs['displayformat'] ? scope.displayformat : defaults.displayFormat
        opts.stringToTime = attrs['stringtotime'] ? scope.stringtotime : defaults.stringToTime
        var notFunctions = _.pick(scope, ['allowtbd', 'hour12'])
        _.extend(opts, _.defaults(notFunctions, { allowtbd: false, hour12: true }))

        scope.displayTime = opts.displayFormat(scope.time, opts.hour12, opts.allowtbd)

        scope.updateTime = function(){
          var newTime = opts.stringToTime(scope.displayTime, opts.allowtbd)
          scope.time = (newTime === null) ? scope.time : newTime
          scope.displayTime = opts.displayFormat(scope.time, opts.hour12, opts.allowtbd)
        }

      }
    }
  })

}())
