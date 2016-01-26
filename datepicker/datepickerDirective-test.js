;(function() {
'use strict'

describe('datepickerDirective', function() {

  var $compile, outerScope, el
  var blankValid, date

  beforeEach(angular.mock.module('sport.ng'))
  beforeEach(angular.mock.module('sport.ng.templates'))

  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_
    outerScope = $rootScope.$new()

    date = 'January 26 2016'
    blankValid = false
  }))

  function compile() {
    var template = '<div>' +
                   '  <input datepicker type="text" ng-model="date" blank-valid="blankValid" />' +
                   '  <datepicker-calendar></datepicker-calendar>' +
                   '</div>'

    _.defaults(outerScope, {
      blankValid: blankValid,
      date: date
    })

    el = $compile(template)(outerScope)
    outerScope.$digest()
  }

  it('should compile', function() {
    compile()
    expect(datePickerInput().val()).toEqual(date)
  })

  it('should compile a valid date to the format "MMMM D YYYY"', function() {
    date = 'Jan 05 2016'
    compile()
    expect(datePickerInput().val()).toEqual('January 5 2016')
  })

  it('should compile an invalid date to empty string', function() {
    date = 'A%$*9 99 -1'
    compile()
    expect(datePickerInput().val()).toEqual('')
  })

  it('should mark invalid text input as invalid', function() {
    compile()
    datePickerInput().val('A%$*9 99 -1').trigger('input');
    outerScope.$apply();
    expect(datePickerInput().hasClass('ng-invalid')).toBe(true)
  })

  it('should mark empty string as invalid when blank-valid="false"', function() {
    blankValid = false
    compile()
    datePickerInput().val('').trigger('input');
    outerScope.$apply();
    expect(datePickerInput().hasClass('ng-invalid')).toBe(true)
  })

  it('should mark empty string as valid when blank-valid="true"', function() {
    blankValid = true
    compile()
    datePickerInput().val('').trigger('input');
    outerScope.$apply();
    expect(datePickerInput().hasClass('ng-invalid')).toBe(false)
  })

  function datePickerInput() {
    return el.find('input:first').eq(0)
  }

})

})();
