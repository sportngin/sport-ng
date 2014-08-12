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

  describe('TimepickerDirective#print default (12hour) format', function () {

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

    it('shoud display 24:00 as 12:00 am', function() {
      $parentScope.timeval = '24:00'
      compileDirective()
      expect($scope.displayTime).toEqual('12:00 am')
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

  describe('TimepickerDirective#print 24hour format', function () {

    it('shoud display a time as it is stored', function() {
      $parentScope.timeval = '22:00'
      $parentScope.format = 'HH:mm'
      compileDirective('<div timepicker time="timeval" print="format"></div>')

      expect($scope.displayTime).toEqual('22:00')
    })

  })

  describe('TimepickerDirective#print TBD allowed', function () {

    it('shoud display \'\' as "TBD" when TBD is allowed', function() {
      $parentScope.timeval = ''
      $parentScope.tbd = true
      compileDirective('<div timepicker time="timeval" allowtbd="tbd"></div>')

      expect($scope.displayTime).toEqual('TBD')
      expect($scope.time).toEqual('')
    })

  })

  describe('TimepickerDirective#print custom', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = function() { return 'rm -fr /' }
      compileDirective('<div timepicker time="timeval" print="format"></div>')
    })

    it('should override default print function', function(){
      expect($scope.displayTime).toEqual('rm -fr /')
      expect($scope.time).toEqual('23:00')
    })

  })

  describe('TimepickerDirective#parse', function(){
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
      $scope.displayTime = '3:ksd00 am'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('3:00 am')
      expect($scope.time).toEqual('03:00')
    })

  })

  describe('TimepickerDirective#parse TBD allowed', function(){
    beforeEach(function(){
      $parentScope.timeval = ''
      $parentScope.tbd = true
      compileDirective('<div timepicker time="timeval" allowtbd="tbd"></div>')
    })

    it('shoud transform "tbd" to "TBD" when TBD is allowed', function() {
      $scope.displayTime = 'tbd'
      $scope.updateTime()

      expect($scope.displayTime).toEqual('TBD')
      expect($scope.time).toEqual('')
    })

    it('shoud transform an empty string to "TBD" when TBD is allowed', function() {
      $scope.displayTime = ''
      $scope.updateTime()

      expect($scope.displayTime).toEqual('TBD')
      expect($scope.time).toEqual('')
    })

  })

  describe('TimepickerDirective#parse without colon', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      compileDirective()
    })

    it('should correctly parse a time without a colon', function(){
      $scope.displayTime = '1000 pm'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('10:00 pm')
      expect($scope.time).toEqual('22:00')
    })

    it('should correctly parse a 2 digit time without a colon', function(){
      $scope.displayTime = '10 am'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('10:00 am')
      expect($scope.time).toEqual('10:00')
    })

    it('should correctly parse a 1 digit time without a colon', function(){
      $scope.displayTime = '2 am'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('2:00 am')
      expect($scope.time).toEqual('02:00')
    })

  })

  describe('TimepickerDirective#parse custom', function(){
    beforeEach(function(){
      $parentScope.timeval = '23:00'
      $parentScope.format = function() { return moment('9:00am', 'h:mma') }
      compileDirective('<div timepicker time="timeval" parse="format"></div>')
    })

    it('should override default parse function', function(){
      $scope.displayTime = '11:00 pm'
      $scope.updateTime()
      expect($scope.displayTime).toEqual('9:00 am')
      expect($scope.time).toEqual('09:00')
    })

  })

})
