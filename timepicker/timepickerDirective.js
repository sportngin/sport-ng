/*
Timepicker directive

Usage:

  The timepicker directive should be used whereever a timepicker input
  be displayed:

    <input timepicker ng-model="ctrl.eventTime" />

saveFormat attribute:
  The saveFormat attributed is optional and tells moment what type of date/time format to expect
  set to `HH:mm` by default
  must be a valid moment format string

allowtbd attribute:
  The allowtbd attribute is optional and denotes whether a blank time will be rejected
  set to `false` by default
  must be a boolean

print attribute:
  The print attribute is optional and converts a time string value to a date
  set to `h:mm a` by default
  must be one of the following:
  1. moment date format string
  2. function accepting the following parameters: val (moment object), allowTBD (boolean), and returning a time string to display

parse attribute:
  This parse attribute is optional and converts an entered string into a moment time
  set to `['h:ma', 'H:m', 'hma', 'Hm']` by default
  must be one of the following:
  1. moment date format string or array of such strings
  2. function accepting the following paramters: val (string), allowTBD (boolean), and returning a moment object to be saved

*/

;(function() {
'use strict'

var parse = function(val, format, allowTBD) {
  if (angular.isFunction(format)) {
    return format(val, allowTBD)
  }
  val = val.trim()
  if (allowTBD && (!val || val.toUpperCase() == 'TBD')) return moment('TBD')

  var time = val.replace(/[^\d:ap]/gi, '')
  var momentTime = moment(time, format)
  // roll 24:00 over to 0:00
  if (momentTime.parsingFlags().overflow != -1) momentTime = moment(momentTime.toDate())
  return momentTime
}

function print(time, format, allowTBD) {
  if (angular.isFunction(format) ) {
    return format(time, allowTBD)
  }
  // roll 24:00 over to 0:00
  if (time.parsingFlags().overflow != -1) time = moment(time.toDate())
  if (!time.isValid()){
    return ''
  }
  return time.format(format)
}

var defaults = {
  allowtbd: false,
  saveFormat: 'HH:mm',
  print: 'h:mm a',
  parse: ['h:ma', 'H:m', 'hma', 'Hm', 'ha']
}

angular.module('sport.ng')
  .directive('timepicker', function(_, i18ng) {
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

        if (opts.allowtbd && !('placeholder' in attrs)) element.attr('placeholder', i18ng.t('time_tbd'))

        function fromModel(modelValue) {
          return print(moment(modelValue, opts.saveFormat), opts.print, opts.allowtbd)
        }

        function toModel(viewValue) {
          var newTime = parse(viewValue, opts.parse, opts.allowtbd)
          if (newTime._i == 'TBD' || viewValue == "") return ''
          return newTime.isValid() ? newTime.format(opts.saveFormat) : undefined
        }

        ngModel.$formatters.push(fromModel)
        ngModel.$parsers.push(toModel)

        element.on('blur', function() {
          if (ngModel.$viewValue != "")
            element.val(fromModel(ngModel.$modelValue))
        })

      }
    }
  })

}())
