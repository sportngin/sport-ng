;(function() {
'use strict'

describe('spinnerButton', function () {
  var $compile
  var $q
  var $parentScope
  var elm
  var click

  beforeEach(angular.mock.module('sport.ng'))
  beforeEach(angular.mock.module('sport.ng.templates'))

  beforeEach(inject(function(_$compile_, _$httpBackend_, $rootScope, $templateCache, _$q_) {
    $compile = _$compile_
    $q = _$q_
    $parentScope = $rootScope.$new()
    click = function() { }
  }))

  function compileDirective(tpl) {
    if (!tpl) {
      tpl = "<button spinner-button spinner-click='click()'></div>"
    }
    elm = $compile(tpl)($parentScope)
    $parentScope.$digest()
    $parentScope.click = click
  }

  it('should initialize', function() {
    compileDirective()
  })

  it('should call spinner-click handler', function() {
    compileDirective()
    spyOn($parentScope, 'click').and.callThrough()
    elm.triggerHandler('click')
    expect($parentScope.click.calls.count()).toEqual(1)
  })

  describe('spinner-click #promise', function() {
    var dfd
    beforeEach(function() {
      dfd = $q.defer()
      click = function() { return dfd.promise }
      compileDirective()
      elm.triggerHandler('click')
    })

    it('should set spinning when promise is returned from spinner-click', function() {
      expect(elm.hasClass('spinning')).toBe(true)
    })

    it('should clear spinning when promise resolves', function() {
      dfd.resolve()
      $parentScope.$digest()
      expect(elm.hasClass('spinning')).toBe(false)
    })
  })
})

})();
