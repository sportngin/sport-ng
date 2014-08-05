
describe('ProgressBar', function() {

  var directive
  var MockDirective
  var $q

  beforeEach(module('sport.ng.templates'))
  beforeEach(module('sport.ng'))

  beforeEach(inject(function(_$q_, _MockDirective_) {
    $q = _$q_
    MockDirective = _MockDirective_
  }))

  beforeEach(function(){
    MockPusher.start()
  })
  afterEach(function(){
    MockPusher.reset()
  })

  it('should update width on promise notify', function() {
    var dfd = $q.defer()
    var promise = dfd.promise
    directive = new MockDirective('<div progress-bar promise="parentScopePromise"></div>', {parentScopePromise: promise})
    dfd.notify({total: 10, completed: 6})
    directive.$scope.$apply()
    expect(directive.$scope.progressWidth()).toBe('60%')
  })

  it('should force 100% width on promise resolve', function() {
    var dfd = $q.defer()
    var promise = dfd.promise
    directive = new MockDirective('<div progress-bar promise="parentScopePromise"></div>', {parentScopePromise: promise})
    dfd.resolve()
    directive.$scope.$apply()
    expect(directive.$scope.progressWidth()).toBe('100%')
  })

})
