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
      tpl = '<div minicolors color="colorval"></div>'
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

    it('should initialize with default attributes', function() {
      expect(elm.find('input').attr('maxlength')).toEqual('7')
      expect(elm.find('input').attr('autocomplete')).toEqual('false')
    })

    it('should default color to #ffffff', function() {
      expect(anchorScope.color).toEqual('#ffffff')
      expect(elm.find('a').css('background-color')).toEqual('rgb(255, 255, 255)')
    })

    it('should hide colorpicker by default', function() {
      expect(pickerScope.showing).toBe(false)
    })

  })

  describe('AngularMinicolors#initialization without defaults', function() {

    beforeEach(function() {
      $parentScope.colorval = "#000000"
      compileDirective('<div minicolors color="colorval" maxlength="8" autocomplete="true" class="x100"></div>')
    })

    it('should transfer classes to colorpicker', function() {
      expect(elm.find('span').hasClass('x100')).toBe(true)
    })

    it('should transfer attributes to colorpicker', function() {
      expect(elm.find('input').attr('maxlength')).toEqual('8')
      expect(elm.find('input').attr('autocomplete')).toEqual('true')
    })

    it('should display correct color', function(){
      expect(elm.find('a').css('background-color')).toEqual('rgb(0, 0, 0)')
    })

  })

})
