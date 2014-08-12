/*
Timepicker directive

Usage:

  The timepicker directive should be used whereever a timepicker input
  be displayed:

    <timepicker time="ctrl.eventTime"></timepicker>

time attribute:
  The time attribute is required and takes the place of ng-model
  must be a string in the form promised by `dateformat`.

dateFormat attribute:
  The dateFormat attributed is required and tells moment what type of date/time format to expect
  must be a string that is a valid moment format

allowtbd attribute:
  The allowtbd attribute is not required and denotes whether a blank time will be converted to 'TBD' or rejected
  set to `false` by default
  must be a boolean

print attribute:
  The print attribute is not required and is a function that converts a time string value to a date
  set to local function by default
  must be a function accepting the following parameters: time (string), allowTBD (boolean)

parse attribute:
  This parse attribute is not required and is a function that converts an entered string into a time string
  set to local function by default
  must be one of the following:
  1. moment date format string
  2. function accepting the following parameters: val (string), allowTBD (boolean), and returning a valid moment string or object

*/

;(function() {
'use strict'

var parse = function(val, allowTBD) {
  var whitespaceOnly = !val.match(/\S/) //still a usefull function?
  if (allowTBD && (whitespaceOnly || val.toUpperCase() == 'TBD')) return ''

  var time = val.replace(/[^\damp]/gi, '')
  var formats = ['hhmma', 'hmma', 'hhma', 'hma', 'HHmm', 'Hmm', 'HHm', 'Hm']

  var momentTime = moment(time, formats)

  console.log(momentTime.format(''))

  return momentTime.isValid() ? momentTime : null

}

var defaults = {
  allowtbd: false,
  saveFormat: 'HH:mm',
  print: 'h:mm a',
  parse: parse
}

angular.module('sport.ng')
  .directive('timepicker', function(_) {
    return {
      restrict: 'A',
      scope: {
        time: '=',
        allowtbd: '=',
        saveFormat: '=',
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
        _.extend(opts, _.defaults(_.pick($scope, ['allowtbd', 'saveFormat', 'print', 'parse']), defaults))

        //moment is stupid and will not accept 24:00 strings
        if ($scope.time == '24:00') $scope.time = '00:00'
        $scope.momentTime = moment($scope.time, opts.saveFormat)

        $scope.displayTime = print($scope.momentTime, opts.print, opts.allowtbd)

        $scope.updateTime = function(){
          var newTime = opts.parse($scope.displayTime, opts.allowtbd)
          //don't change the time if the time was invalid
          $scope.momentTime = (newTime === null) ? $scope.momentTime : newTime
          //supports setting the time to '' in case of TBD
          //highly suspect. could be used to break timepicker when combined with custom print method
          $scope.time = $scope.momentTime.isValid() ? $scope.momentTime.format(opts.saveFormat) : $scope.momentTime._i
          $scope.displayTime = print($scope.momentTime, opts.print, opts.allowtbd)
        }

        function print(time, format, allowTBD) {
          if (!time.isValid()){
            if (allowTBD) return 'TBD'
            return ''
          }
          if (angular.isFunction(format) ) {
            return format(time, allowTBD)
          }
          return $scope.momentTime.format(format)
        }

      }
    }
  })

}())
