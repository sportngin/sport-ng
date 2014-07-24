
ddescribe('ProgressBar', function() {

  var directive
  var MockDirective

  beforeEach(module('sport.ng.templates'))
  beforeEach(module('sport.ng'))
  beforeEach(inject(function(_MockDirective_) { MockDirective = _MockDirective_ }))

  it('should use `percent` if passed in', function() {
    directive = new MockDirective('<div progress-bar percent="73" total="10" completed="4"></div>')
    expect(directive.$isolateScope.progress()).toBe(73)
  })

  it('should calculate `percent` if not passed in', function() {
    directive = new MockDirective('<div progress-bar total="10" completed="4"></div>')
    expect(directive.$isolateScope.progress()).toBe(40)
  })

  describe('Pusher Integration', function() {

    var channel
    var channelName = 'private-foo'

    beforeEach(function() {
      Pusher = new MockPusher()
      channel = Pusher.subscribe(channelName)
    })

    afterEach(function() {
      MockPusher.instances.splice(0) // clear any old instances
    })

    it('accepts a pusher channel if pased in options', function() {
      directive = new MockDirective('<div progress-bar remote-job="jobInParentScope"></div>', {jobInParentScope: channel})
      expect(directive.$scope.remoteJob).toBe(channel)
    })

    it('connect the the correct pusher channel if pased a channel name in options', function() {
      directive = new MockDirective('<div progress-bar remote-job="\''+channelName+'\'"></div>')
      expect(directive.$scope.remoteJob).toBe(channel)
    })

    it('should destroy $scope when animation completes if `closeWhenComplete` is set', function() {
      directive = new MockDirective('<div progress-bar close-when-complete remote-job="jobInParentScope"></div>', {jobInParentScope: channel})
      spyOn(directive.$scope, '$destroy')

      jasmine.clock().install()

      channel.emit('completed', {})
      expect(directive.$scope.$destroy).not.toHaveBeenCalled()
      jasmine.clock().tick(501) // css animation takes 500ms
      expect(directive.$scope.$destroy).toHaveBeenCalled()

      jasmine.clock().uninstall()
    })

  })

})