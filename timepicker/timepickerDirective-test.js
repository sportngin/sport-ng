describe('selectActive', function () {
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
    console.log(elm)
  })

  describe('#href', function () {
    beforeEach(function() {
      $parentScope.timeval = '00:00'
    })

    it('should be active when location matches href', function() {
      compileDirective()
      console.log($scope.displayTime)
      console.log(elm)
    })

  })

})
