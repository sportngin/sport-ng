;(function() {
'use strict'

describe('TournamentRegistrationSettings', function() {

  var $compile
  var moment
  var outerScope
  var el
  var baseObj

  beforeEach(angular.mock.module('sport.ng'))
  beforeEach(angular.mock.module('sport.ng.templates'))

  beforeEach(inject(function(_$compile_, _moment_, $rootScope) {
    $compile = _$compile_
    moment = _moment_
    outerScope = $rootScope.$new()
    baseObj = {
      name: 'testDate',
      datetime: '2015-03-14T15:42:00+00:00',
      timezone: 'America/Los_Angeles'
    }
    outerScope.baseObj = baseObj
  }))

  function compile() {
    var template = '<div datetime-fields name="baseObj.name" datetime="baseObj.datetime" timezone="baseObj.timezone"></div>'
    el = $compile(template)(outerScope)
    outerScope.$digest()
  }

  it('should compile', function() {
    compile()
  })

  function dateField() {
    return el.find('input[id="' + baseObj.name + 'Date"]:first')
  }

  function timeField() {
    return el.find('input[id="' + baseObj.name + 'Time"]:first')
  }

  describe('date', function() {
    it('should add the field', function() {
      compile()
      expect(dateField().length).toBe(1)
    })
    it('should correctly populate with date', function() {
      compile()
      expect(dateField().val()).toBe('March 14 2015')
    })
    it('should correctly populate without date', function() {
      baseObj.datetime = null
      compile()
      expect(dateField().val()).toBe('')
    })
    it('should correctly update', function() {
      compile()
      dateField().val('March 15 2015').change()
      expect(baseObj.datetime).toBe('2015-03-15T15:42:00+00:00')
    })
    it('shoudl clear', function() {
      compile()
      dateField().val('').change()
      expect(baseObj.datetime).toBe(null)
    })
  })

  describe('time', function() {
    it('should add the field', function() {
      compile()
      expect(timeField().length).toBe(1)
    })
    it('should correctly populate with time', function() {
      compile()
      expect(timeField().val()).toBe('08:42')
    })
    it('should correctly populate without time', function() {
      baseObj.datetime = null
      compile()
      expect(timeField().val()).toBe('')
    })
    it('should correctly update', function() {
      compile()
      timeField().val('09:23').change()
      expect(baseObj.datetime).toBe('2015-03-14T16:23:00+00:00')
    })
  })

})

})();
