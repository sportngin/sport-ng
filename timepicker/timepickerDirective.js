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
  must be a moment date format string

parse attribute:
  This parse attribute is optional and converts an entered string into a moment time
  set to `['h:ma', 'H:m', 'hma', 'Hm']` by default
  must be a moment date format string or array of such strings

*/

;(function() {
'use strict'

var parse = function(val, format) {
  val = val.trim()

  var time = val.replace(/[^\d:ap]/gi, '')
  var momentTime = moment(time, format)
  // roll 24:00 over to 0:00
  if (momentTime.parsingFlags().overflow != -1) momentTime = moment(momentTime.toDate())
  return momentTime
}

function print(time, format) {
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
  printFormat: 'h:mm a',
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
        printFormat: '=',
        parse: '='
      },
      link: function(scope, element, attrs, ngModel) {

        function getScopeOpt(opt) { return scope[opt] || defaults[opt] }
        function tbdViewValue(val) {
          if (!getScopeOpt('allowtbd')) return false
          return (!val || val.toUpperCase() == 'TBD')
        }

        if (getScopeOpt('allowtbd') && !('placeholder' in attrs)) element.attr('placeholder', i18ng.t('time_tbd'))

        function fromModel(modelValue) {
          return print(moment(modelValue, getScopeOpt('saveFormat')), getScopeOpt('printFormat'))
        }

        function toModel(viewValue) {
          if (tbdViewValue(viewValue)) return undefined

          var newTime = parse(viewValue, getScopeOpt('parse'))
          return newTime.isValid() ? newTime.format(getScopeOpt('saveFormat')) : ngModel.$modelValue
        }

        ngModel.$formatters.push(fromModel)
        ngModel.$parsers.push(toModel)

        element.on('blur', function() {
          ngModel.$viewValue = fromModel(ngModel.$modelValue)
          ngModel.$render()
        })

      }
    }
  })

}())
