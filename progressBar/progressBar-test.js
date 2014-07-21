
ddescribe('ProgressBar', function() {

  var directive
  var MockDirective

  beforeEach(module('sport.ng'))

  beforeEach(inject(function(_MockDirective_) {
    MockDirective = _MockDirective_
  }))

  it('should use `percent` if passed in', function() {
    directive = new MockDirective('<div progress-bar percent="73"></div>')
    expect(directive.$scope.progress()).toBe(73)
  })

  it('should calculate `percent` if not passed in', function() {
    directive = new MockDirective('<div progress-bar total="10" completed="4"></div>')
    expect(directive.$scope.progress()).toBe(40)
  })

})