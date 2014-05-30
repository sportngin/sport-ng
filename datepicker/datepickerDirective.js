/*
Datepicker directive

Usage:

  The datepicker-calendar directive must be included on the page near
  the bottom of the DOM:

    <datepicker-calendar></datepicker-calendar>

  The datepicker directive should be used whereever a datepicker input
  be displayed:

    <datepicker date="ctrl.eventDate"></datepicker>

date attribute:
  The date attribute is required and takes the place of ng-model and
  must be a date object.

*/

;(function() {
'use strict'

// state of the state
var refocusing = false

// try to use built-in international date formatter
var formatter
if ('Intl' in window) {
  formatter = window.Intl.DateTimeFormat(undefined, {day:'numeric', month:'short', year:'numeric'})
}

function monthName(month) {
  return ['January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August', 'September',
          'October', 'November', 'December'][month]
}

function isLeapYear(year) {
  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
}

function daysInMonth(year, month) {
  return [31, (isLeapYear(year)? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

function nextMonth(year, month) {
  return month < 11 ? { year:year, month:month+1 } : { year:year+1, month:0 }
}

function previousMonth(year, month) {
  return month ? { year:year, month:month-1 } : { year:year-1, month:11 }
}

function displayFormat(date) {
  if (!date || !date.valueOf || !date.valueOf()) return ''
  if (formatter) return formatter.format(date)
  return monthName(date.getMonth()).substring(0, 3) + ' ' + date.getDate() + ', ' + date.getFullYear()
}

function stringToDate(val) {
  val = val && val.replace(/-/g, '/') || ''
  var date, d = Date.parse(val)
  if (!d && !val) return

  // Check for a year in the input value
  if (!/\d{4}/.test(val)) {
    // Set to current year if no year
    val += ' ' + new Date().getFullYear()
    d = new Date(val)
    if (!d.valueOf())
      val = val.replace(/\ /g, '/')
  }

  date = new Date(val)
  return date.valueOf() ? date : null
}

function calendarDays(year, month, date) {
  var pmonth = previousMonth(year, month)
  var dim = daysInMonth(year, month)
  var pdim = daysInMonth(pmonth.year, pmonth.month)
  var monthStart = (new Date(year, month, 1)).getDay()
  var monthEnd = (new Date(year, month, dim)).getDay()
  var now = new Date()
  var thisMonth = month == now.getMonth() && year == now.getFullYear()

  var days = [[]]
  // previous month days
  if (monthStart > 0) {
    for (var i = pdim+1 - monthStart; i <= pdim; i++) {
      days[0].push({ day:i, disabled:true })
    }
  }
  // month days
  for (var i = 1; i <= dim; i++) {
    if ((monthStart + i - 1) % 7 === 0) days.push([])
    var today = thisMonth && i == now.getDate()
    days[days.length-1].push({ day:i, today:today })
  }
  // next month days
  for (var i = 1; i < 7 - (monthEnd); i++) {
    days[days.length-1].push({ day:i, disabled:true })
  }
  return days
}

angular.module('sport.ng')
  .directive('datepicker', function(DatepickerService, _, $timeout) {
    return {
      restrict: 'E',
      scope: {
        date: '='
      },
      templateUrl: '/bower_components/sport-ng/datepicker/datepicker.html',
      link: function(scope, element, attrs) {
        // transfer some of the attributes to the input, removing them from the datepicker element
        var attributes = _.pick(attrs, ['id', 'name', 'tabindex'])
        _.each(attributes, function(val, name) { element.removeAttr(name) })
        element.find('input').attr(attributes)
        if (attrs['class']) element.find('input').addClass(attrs['class'].replace(/ng-[^\s]+/g, ''))

        if (scope.date) {
          scope.displayDate = displayFormat(scope.date)
        }

        function setDate(date) {
          scope.date = date
          scope.displayDate = displayFormat(date)
        }

        scope.show = function() {
          if (!refocusing)
            DatepickerService.show(element, scope.date, setDate)
        }

        scope.tryHide = function(dontParse) {
          DatepickerService.tryHide()
          if (!dontParse) {
            var date = stringToDate(scope.displayDate)
            if (date != scope.date) setDate(date)
          }
        }

        scope.hide = function() {
          DatepickerService.hide()
        }

      }
    }
  })
  .factory('DatepickerService', function() {
    var currentCallback = null
    var picker = {
      show: function(element, date, callback) {
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
      restrict: 'E',
      scope: {},
      templateUrl: '/bower_components/sport-ng/datepicker/datepickerCalendar.html',
      link: function(scope, element, attrs) {
        element.css('z-index', 9999)

        var clicking = false
        element.on('mousedown', function() { clicking = true; refocus() })
        element.on('mouseup', function() { clicking = false })

        function setScope(year, month) {
          var date = DatepickerService.date
          var day = date && date.getMonth() == month && date.getFullYear() == year ? date.getDate() : null
          scope.date = day
          scope.month = month
          scope.year = year
          scope.monthName = monthName(month)
          scope.calDays = calendarDays(year, month, day)
        }

        function hide() {
          DatepickerService.hide()
        }

        function refocus() {
          setTimeout(function() {
            if (DatepickerService.element) {
              refocusing = true
              DatepickerService.element.find('input').focus()
              refocusing = false
            }
          }, 1)
        }

        scope.select = function(year, month, date, disabled) {
          if (disabled) return
          var newDate = new Date(year, month, date)
          DatepickerService.set(newDate)
          hide()
        }

        scope.nextMonth = function(year, month) {
          var next = nextMonth(year, month)
          setScope(next.year, next.month)
        }

        scope.previousMonth = function(year, month) {
          var prev = previousMonth(year, month)
          setScope(prev.year, prev.month)
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
            if (!date) date = new Date()
            setScope(date.getFullYear(), date.getMonth())
          })

        scope.$watch(
          function() { return DatepickerService.element },
          function(target, oldVal) {
            if (!target) return scope.showing = false

            var tether = new Tether({
              element: element[0],
              target: target[0],
              attachment: 'top left',
              targetAttachment: 'bottom left',
              offset: '-8px 0',
              constraints: [{ to: 'scrollParent', attachment: 'together' }]
            })

            scope.showing = true
            tether.position()
          })


      }
    }

  })

}())
