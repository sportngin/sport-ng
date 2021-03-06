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

  describe('#placeholders TBD allowed', function() {

    describe('no placeholder', function() {
      beforeEach(function(){
        compileDirective('<input timepicker ng-model="timeval" allowtbd="true" />')
      })

      it('should replace lack of placeholder with "TBD"', function() {
        expect(elm.attr('placeholder')).toEqual('TBD')
      })

    })

    describe('empty placeholder', function() {
      beforeEach(function(){
        compileDirective('<input timepicker ng-model="timeval" allowtbd="true" placeholder="" />')
      })

      it('should allow placeholder to be an empty string', function() {
        expect(elm.attr('placeholder')).toEqual('')
      })

    })

    describe('different placeholder', function() {
      beforeEach(function(){
        compileDirective('<input timepicker ng-model="timeval" allowtbd="true" placeholder="asdfk" />')
      })

      it('should not override specificed placeholder', function() {
        expect(elm.attr('placeholder')).toEqual('asdfk')
      })

    })



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
      compileDirective('<input timepicker ng-model="timeval" print-format="format" />')
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

  describe('#print custom format', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = 'HH:mm'
      compileDirective('<input timepicker ng-model="timeval" print-format="format" />')
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

    it('should transform "tbd" to undefined when TBD is allowed', function() {
      changeInput(elm, 'tbd')
      expect(elm.val()).toEqual('')
      expect($parentScope.timeval).toBeUndefined()
    })

    it('should transform an "TBD" to undefined when TBD is allowed', function() {
      changeInput(elm, 'TBD')
      expect(elm.val()).toEqual('')
      expect($parentScope.timeval).toBeUndefined()
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

  describe('#parse custom format string', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = 'h:mm:ss'
      compileDirective('<input timepicker ng-model="timeval" parse="format" />')
    })

    it('should override the default parse format', function(){
      changeInput(elm, '11:46:03')
      expect(elm.val()).toEqual('11:46 am')
      expect($parentScope.timeval).toEqual('11:46')
    })

  })

  describe('#parse custom format array', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = ['h:mm', 'h:mm:ssa']
      compileDirective('<input timepicker ng-model="timeval" parse="format" />')
    })

    it('should override the default parse function', function(){
      changeInput(elm, '9:11:44 pm')
      expect(elm.val()).toEqual('9:11 pm')
      expect($parentScope.timeval).toEqual('21:11')
    })

  })

})
