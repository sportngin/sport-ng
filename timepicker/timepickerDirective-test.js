describe('TimepickerDirective', function () {
  var $compile, $parentScope, $scope
  var elm

  beforeEach(angular.mock.module('sport.ng'))
  beforeEach(angular.mock.module('sport.ng.templates'))

  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_
    $parentScope = $rootScope.$new()
  }))

  function compileDirective(tpl) {
    if (!tpl) {
      tpl = '<input timepicker ng-model="timeval" />'
    }
    elm = $compile(tpl)($parentScope)
    $parentScope.$digest()
    $scope = elm.isolateScope()
  }

  function changeInput(element, value) {
    element.val(value)
    element.trigger('input')
    $(elm).blur()
  }

  it('should initialize', function() {
    compileDirective()
  })

  describe('#print default (12hour) format', function () {

    it('should display 00:00 as 12:00 am', function() {
      $parentScope.timeval = '00:00'
      compileDirective()
      expect(elm.val()).toEqual('12:00 am')
    })

    it('should display 12:00 as 12:00 pm', function() {
      $parentScope.timeval = '12:00'
      compileDirective()
      expect(elm.val()).toEqual('12:00 pm')
    })

    it('should display 24:00 as 12:00 am', function() {
      $parentScope.timeval = '24:00'
      compileDirective()
      expect(elm.val()).toEqual('12:00 am')
    })

    it('should display evening times as a pm string with a single character hour', function() {
      $parentScope.timeval = '13:00'
      compileDirective()
      expect(elm.val()).toEqual('1:00 pm')
    })

    it('should display evening times as pm string with a double character hour', function() {
      $parentScope.timeval = '22:00'
      compileDirective()
      expect(elm.val()).toEqual('10:00 pm')
    })

  })

  describe('#print 24hour format', function () {

    it('should display a time as it is stored', function() {
      $parentScope.timeval = '22:00'
      $parentScope.format = 'HH:mm'
      compileDirective('<input timepicker ng-model="timeval" print="format" />')
      expect(elm.val()).toEqual('22:00')
    })

  })

  describe('#print TBD allowed', function () {

    it('should display "" as "" when TBD is allowed', function() {
      $parentScope.timeval = ''
      $parentScope.tbd = true
      compileDirective('<input timepicker ng-model="timeval" allowtbd="tbd" />')
      expect(elm.val()).toEqual('')
    })

  })

  describe('#print custom function', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = function() { return 'rm -fr /' }
      compileDirective('<input timepicker ng-model="timeval" print="format" />')
    })

    it('should override default print function', function(){
      expect(elm.val()).toEqual('rm -fr /')
      expect($parentScope.timeval).toEqual('23:00')
    })

  })

  describe('#print custom format', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = 'HH:mm'
      compileDirective('<input timepicker ng-model="timeval" print="format" />')
    })

    it('should override default print function', function(){
      expect(elm.val()).toEqual('23:00')
      expect($parentScope.timeval).toEqual('23:00')
    })

  })

  describe('#parse', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      compileDirective()
    })

    it('should not change the time if an empty string is entered', function(){
      changeInput(elm, '')
      expect(elm.val()).toEqual('11:00 pm')
      expect($parentScope.timeval).toEqual('23:00')
    })

    it('should correctly parse 24:00', function() {
      changeInput(elm, '24:00')
      expect(elm.val()).toEqual('12:00 am')
      expect($parentScope.timeval).toEqual('00:00')
    })

    it('should ignore non-digit characters', function(){
      changeInput(elm, '3:ksd00 am')
      expect(elm.val()).toEqual('3:00 am')
      expect($parentScope.timeval).toEqual('03:00')
    })

    it('should ignore meridiem case', function(){
      changeInput(elm, '4:00 AM')
      expect(elm.val()).toEqual('4:00 am')
      expect($parentScope.timeval).toEqual('04:00')
    })

  })

  describe('#parse TBD allowed', function(){
    beforeEach(function(){
      $parentScope.timeval = ''
      $parentScope.tbd = true
      compileDirective('<input timepicker ng-model="timeval" allowtbd="tbd" />')
    })

    it('should transform "tbd" to "" when TBD is allowed', function() {
      changeInput(elm, 'tbd')
      expect(elm.val()).toEqual('')
      expect($parentScope.timeval).toEqual('')
    })

    it('should transform an "TBD" to "" when TBD is allowed', function() {
      changeInput(elm, 'TBD')
      expect(elm.val()).toEqual('')
      expect($parentScope.timeval).toEqual('')
    })

  })

  describe('#parse without colon', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      compileDirective()
    })

    it('should correctly parse a time without a colon', function(){
      changeInput(elm, '1000 pm')
      expect(elm.val()).toEqual('10:00 pm')
      expect($parentScope.timeval).toEqual('22:00')
    })

    it('should correctly parse a 2 digit time without a colon', function(){
      changeInput(elm, '10 am')
      expect(elm.val()).toEqual('10:00 am')
      expect($parentScope.timeval).toEqual('10:00')
    })

    it('should correctly parse a 1 digit time without a colon', function(){
      changeInput(elm, '2 am')
      expect(elm.val()).toEqual('2:00 am')
      expect($parentScope.timeval).toEqual('02:00')
    })

  })

  describe('#parse custom', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = function() { return moment('9:00am', 'h:mma') }
      compileDirective('<input timepicker ng-model="timeval" parse="format" />')
    })

    it('should override the default parse function', function(){
      changeInput(elm, '10:00 pm')
      expect(elm.val()).toEqual('9:00 am')
      expect($parentScope.timeval).toEqual('09:00')
    })

  })

})
