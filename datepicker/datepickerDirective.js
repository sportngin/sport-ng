/*
Datepicker directive

Usage:

  The datepicker-calendar directive must be included on the page near
  the bottom of the DOM:

    <datepicker-calendar></datepicker-calendar>

  The datepicker directive should be used whereever a datepicker input
  should be displayed:

    <input datepicker type="text" ng-model="ctrl.eventDate" />

ng-model attribute:
  ng-model is required and will store dates in YYYY-MM-DD format

*/

;(function() {
'use strict'

// state of the state
var refocusing = false

function displayFormat(date) {
  return (moment(date).isValid() && !!date) ? moment(date).format('MMMM D YYYY'): ''
}

function modelFormat(date) {
  var formats = ['MMMM D YYYY', 'MM DD YYYY']
  var date = moment(date, formats)
  return date.isValid() ? date.format('YYYY-MM-DD') : null
}

// Returns an array of arrays for the given month.
// Each array represents a week and contains seven days.
function calendarDays(year, month) {
  var current = moment({'year': year, 'month': month})
  var previous = moment({'year': year, 'month': month - 1})
  var now = moment()
  var thisMonth = month == now.month() && year == now.year()

  var days = [[]]
  // previous month days
  if (current.startOf('month').day() > 0) {
    for (var i = previous.daysInMonth() + 1 - current.startOf('month').day(); i <= previous.daysInMonth(); i++) {
      days[0].push({ day:i, disabled:true })
    }
  }
  // month days
  for (var i = 1; i <= current.daysInMonth(); i++) {
    if ((current.startOf('month').day() + i - 1) % 7 === 0) days.push([])
    var today = thisMonth && i == now.date()
    days[days.length-1].push({ day:i, today:today })
  }
  // next month days
  for (var i = 1; i < 7 - (current.endOf('month').day()); i++) {
    days[days.length-1].push({ day:i, disabled:true })
  }
  return days
}

angular.module('sport.ng')
  .directive('datepicker', function(DatepickerService, _, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.addClass('datepicker')

        function setDate(date) {
          ngModel.$setViewValue(displayFormat(date))
          ngModel.$render()
        }

        function show() {
          if (!refocusing)
            DatepickerService.show(element, ngModel.$modelValue, setDate)
        }

        ngModel.$formatters.push(displayFormat)
        ngModel.$parsers.push(modelFormat)

        element.on('blur', function() {
          setDate(ngModel.$modelValue)
          scope.$apply(setDate(ngModel.$modelValue))
        })
        element.on('focus', function() {
          scope.$apply(show)
        })
        element.on('click', function() {
          scope.$apply(show)
        })

      }
    }
  })
  .factory('DatepickerService', function() {
    var currentCallback = null
    var picker = {
      show: function(element, date, callback) {
        if (element === picker.element) return
        currentCallback = callback
        picker.element = element
        picker.date = date
      },
      hide: function() {
        picker.element = null
        picker.date = null
      },
      tryHide: function() {
        picker.wantsToHide = true
      },
      set: function(date) {
        if (date && typeof currentCallback == 'function')
          currentCallback(date)
      }
    }
    return picker
  })
  .directive('datepickerCalendar', function(DatepickerService) {

    return {
      restrict: 'AE',
      scope: {},
      templateUrl: '/bower_components/sport-ng/datepicker/datepickerCalendar.html',
      link: function(scope, element, attrs) {
        element.css('z-index', 9999)

        var clicking = false
        element.on('mousedown', function() { clicking = true; refocus() })
        element.on('mouseup', function() { clicking = false })

        function setScope(year, month) {
          var date = moment(DatepickerService.date)
          scope.date = date && date.month() == month && date.year() == year ? date.date() : null
          scope.month = month
          scope.year = year
          scope.monthName = moment({'year': year, 'month': month}).format('MMMM')
          scope.calDays = calendarDays(year, month)
        }

        function hide() {
          DatepickerService.hide()
        }

        function refocus() {
          setTimeout(function() {
            if (DatepickerService.element) {
              refocusing = true
              DatepickerService.element.focus()
              refocusing = false
            }
          }, 1)
        }

        scope.select = function(year, month, date, disabled) {
          if (disabled) return
          var newDate = moment({'year': year, 'month': month, 'day': date}).format('YYYY-MM-DD')
          DatepickerService.set(newDate)
          hide()
        }

        scope.nextMonth = function(year, month) {
          var next = moment({'year': year, 'month': month}).add(1, 'month')
          setScope(next.year(), next.month())
        }

        scope.previousMonth = function(year, month) {
          var prev = moment({'year': year, 'month': month}).subtract(1, 'month')
          setScope(prev.year(), prev.month())
        }

        scope.$watch(
          function() { return DatepickerService.wantsToHide },
          function(wantsToHide, oldVal) {
            if (wantsToHide) {
              DatepickerService.wantsToHide = false
              if (!clicking) hide()
            }
          })

        scope.$watch(
          function() { return DatepickerService.date },
          function(date, oldVal) {
            if (!date) date = moment()
            setScope(moment(date).year(), moment(date).month())
          })

        var tetherRef
        scope.$watch(
          function() { return DatepickerService.element },
          function(target, oldVal) {
            if (!target) return scope.showing = false
            if (tetherRef) tetherRef.destroy()

            scope.showing = true
            tetherRef = new Tether({
              element: element[0],
              target: target[0],
              attachment: 'top left',
              targetAttachment: 'bottom left',
              offset: '-16px 0',
              constraints: [{ to: 'scrollParent', attachment: 'together' }]
            })
          })
      }
    }

  })

}())
