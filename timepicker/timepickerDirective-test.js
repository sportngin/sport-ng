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
      tpl = '<div timepicker time="timeval"></div>'
    }
    elm = $compile(tpl)($parentScope)
    $parentScope.$digest()
    $scope = elm.isolateScope()
  }

  it('should initialize', function() {
    compileDirective()
  })

  describe('TimepickerDirective#displayFormat default (12hour) format', function () {

    it('shoud display 00:00 as 12:00 am', function() {
      $parentScope.timeval = '00:00'
      compileDirective()
      expect($scope.displayTime).toEqual('12:00 am')
    })

    it('shoud display 12:00 as 12:00 pm', function() {
      $parentScope.timeval = '12:00'
      compileDirective()
      expect($scope.displayTime).toEqual('12:00 pm')
    })

    it('shoud display evening times as a pm string with a single character hour', function() {
      $parentScope.timeval = '13:00'
      compileDirective()
      expect($scope.displayTime).toEqual('1:00 pm')
    })

    it('shoud display evening times as pm string with a double character hour', function() {
      $parentScope.timeval = '22:00'
      compileDirective()
      expect($scope.displayTime).toEqual('10:00 pm')
    })

  })

  describe('TimepickerDirective#displayFormat 24hour format', function () {

    it('shoud display a time as it is stored', function() {
      $parentScope.timeval = '22:00'
      $parentScope.format12 = false
      compileDirective('<div timepicker time="timeval" hour12="format12"></div>')

      expect($scope.displayTime).toEqual('22:00')
    })

  })

  describe('TimepickerDirective#displayFormat TBD allowed', function () {

    it('shoud display \'\' as "TBD" when TBD is allowed', function() {
      $parentScope.timeval = ''
      $parentScope.tbd = true
      compileDirective('<div timepicker time="timeval" allowtbd="tbd"></div>')

      expect($scope.displayTime).toEqual('TBD')
    })

  })

  describe('TimepickerDirective#stringToTime', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      compileDirective()
    })

    it('should not change the time if an empty string is entered', function(){
      $scope.displayTime = ''
      $scope.updateTime()
      expect($scope.displayTime).toEqual('11:00 pm')
      expect($scope.time).toEqual('23:00')
    })

    it('should ignore non-digit characters', function(){
      $scope.displayTime = '3:asd00 am'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('3:00 am')
      expect($scope.time).toEqual('03:00')
    })

    it('should roll extra minutes into hour', function(){
      $scope.displayTime = '1:62 am'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('2:02 am')
      expect($scope.time).toEqual('02:02')
    })

    it('should roll extra hours into moar hours', function(){
      $scope.displayTime = '26:00 am'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('2:00 am')
      expect($scope.time).toEqual('02:00')
    })

  })

  describe('TimepickerDirective#stringToTime TBD allowed', function(){
    beforeEach(function(){
      $parentScope.timeval = ''
      $parentScope.tbd = true
      compileDirective('<div timepicker time="timeval" allowtbd="tbd"></div>')
    })

    it('shoud transform "tbd" to "TBD" when TBD is allowed', function() {
      $scope.displayTime = 'tbd'
      $scope.updateTime()

      expect($scope.displayTime).toEqual('TBD')
    })

    it('shoud transform an empty string to "TBD" when TBD is allowed', function() {
      $scope.displayTime = ''
      $scope.updateTime()

      expect($scope.displayTime).toEqual('TBD')
    })

  })

})
