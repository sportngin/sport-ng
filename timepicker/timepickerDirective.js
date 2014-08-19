/*
Timepicker directive

Usage:

  The timepicker directive should be used whereever a timepicker input
  be displayed:

    <input timepicker ng-model="ctrl.eventTime" />

time attribute:
  The time attribute is required and takes the place of ng-model
  must be a string in the form promised by `dateformat`.

saveFormat attribute:
  The saveFormat attributed is optional and tells moment what type of date/time format to expect
  set to `HH:mm` by default
  must be a string that is a valid moment format

allowtbd attribute:
  The allowtbd attribute is optional and denotes whether a blank time will be converted to 'TBD' or rejected
  set to `false` by default
  must be a boolean

print attribute:
  The print attribute is optional and is a function that converts a time string value to a date
  set to local function by default
  must be a function accepting the following parameters: time (string), allowTBD (boolean)

parse attribute:
  This parse attribute is optional and is a function that converts an entered string into a time string
  set to local function by default
  must be one of the following:
  1. moment date format string
  2. function accepting the following parameters: val (string), allowTBD (boolean), and returning a valid moment string or object

*/

;(function() {
'use strict'

var parse = function(val, allowTBD) {
  val = val.trim()
  if (allowTBD && (!val || val.toUpperCase() == 'TBD')) return moment('TBD')

  var time = val.replace(/[^\d:ap]/gi, '')
  if (time.match(/24:?0*/)) time = '00:00'
  var formats = ['hh:mma', 'h:mma', 'hh:ma', 'h:ma', 'HH:mm', 'H:mm', 'HH:m', 'H:m', 'hhmma', 'hmma', 'hhma', 'hma', 'HHmm', 'Hmm', 'HHm', 'Hm']

  var momentTime = moment(time, formats)
  return momentTime
}

function print(time, format, allowTBD) {
  if (angular.isFunction(format) ) {
    return format(time, allowTBD)
  }
  if (!time.isValid()){
    if (allowTBD) return 'TBD'
    return ''
  }
  return time.format(format)
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
      require: 'ngModel',
      scope: {
        allowtbd: '=',
        saveFormat: '=',
        print: '=',
        parse: '='
      },
      link: function(scope, element, attrs, ngModel) {

        var opts = {}
        _.extend(opts, _.defaults(_.pick(scope, ['allowtbd', 'saveFormat', 'print', 'parse']), defaults))

        function fromModel(modelValue) {
          if (modelValue == '24:00') modelValue = '00:00'
          return print(moment(modelValue, opts.saveFormat), opts.print, opts.allowtbd)
        }

        function toModel(viewValue) {
          var newTime = opts.parse(viewValue, opts.allowtbd)
          if (newTime._i == 'TBD') return ''
          return newTime.isValid() ? newTime.format(opts.saveFormat) : ngModel.$modelValue
        }

        ngModel.$formatters.push(fromModel)
        ngModel.$parsers.push(toModel)

        element.on('blur', function() {
          element.val(fromModel(ngModel.$modelValue))
        })

      }
    }
  })

}())
