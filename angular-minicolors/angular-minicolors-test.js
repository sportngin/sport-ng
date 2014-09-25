describe('AngularMinicolors', function () {
  var $compile, $parentScope, anchorScope, pickerScope, MinicolorsService
  var elm

  beforeEach(angular.mock.module('sport.ng'))
  beforeEach(angular.mock.module('sport.ng.templates'))

  beforeEach(inject(function(_$compile_, $rootScope, _MinicolorsService_) {
    $compile = _$compile_
    $parentScope = $rootScope.$new()
    MinicolorsService = _MinicolorsService_
  }))

  function compileDirective(tpl) {
    if (!tpl) {
      tpl = '<input type="hidden" minicolors ng-model="colorval" />'
    }
    elm = $compile(tpl)($parentScope)
    picker = $compile('<minicolors-picker></minicolors-picker>')($parentScope)
    $parentScope.$digest()
    anchorScope = elm.isolateScope()
    pickerScope = picker.scope()


  }

  it('should initialize', function() {
    compileDirective()
  })

  describe('AngularMinicolors#initialization default', function() {

    beforeEach(function(){
      compileDirective()
    })

    it('should leave ng-model blank', function() {
      expect(elm.controller('ngModel').$modelValue).not.toBeDefined()
    })

    it('should hide colorpicker by default', function() {
      expect(pickerScope.showing).toBe(false)
    })

  })

  describe('AngularMinicolors#initialization without defaults', function() {

    beforeEach(function() {
      $parentScope.colorval = "#000000"
      compileDirective('<input type="hidden" minicolors ng-model="colorval" />')
    })

    it('should display correct color', function(){
      expect(elm.controller('ngModel').$modelValue).toEqual('#000000')
    })

  })

})
