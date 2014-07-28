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

    // it('shoud display 24:00 as 12:00 pm', function() {
    //   $parentScope.timeval = '24:00'
    //   compileDirective()
    //   expect($scope.displayTime).toEqual('12:00 am')
    // })

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

    it('shoud display 00:00 as 12:00 am', function() {
      $parentScope.timeval = '22:00'
      $parentScope.stuff = false
      compileDirective('<div timepicker time="timeval" hour12="{{stuff}}"></div>')

      //expect($scope.displayTime).toEqual('22:00')
    })

  })

  describe('TimepickerDirective#stringToTime', function(){
    beforeEach(function(){
      $parentScope.timeval = '24:00'
      compileDirective()
    })

    it('should ignore non-digit characters', function(){
      $scope.displayTime = '3:asd00 am'
      elm.find('input').blur()
      expect($scope.displayTime).toEqual('3:00 am')
      expect($scope.time).toEqual('03:00')
    })

    it('should roll extra minutes into hour', function(){
      $scope.displayTime = '1:62 am'
      elm.find('input').blur()
      expect($scope.displayTime).toEqual('2:02 am')
      expect($scope.time).toEqual('02:02')
    })

    it('should roll extra hours into moar hours', function(){
      $scope.displayTime = '26:00 am'
      elm.find('input').blur()
      expect($scope.displayTime).toEqual('2:00 am')
      expect($scope.time).toEqual('02:00')
    })

    it('should roll extra hours into moar hours', function(){
      $scope.displayTime = '26:00 am'
      elm.find('input').blur()
      expect($scope.displayTime).toEqual('2:00 am')
      expect($scope.time).toEqual('02:00')
    })

    it('should ignore meridiem if time otherwise fits 24-hour format', function(){
      $scope.displayTime = '14:00 am'
      elm.find('input').blur()
      expect($scope.displayTime).toEqual('2:00 pm')
      expect($scope.time).toEqual('14:00')
    })


  })

})
