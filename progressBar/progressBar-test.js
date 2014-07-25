
describe('ProgressBar', function() {

  var directive
  var MockDirective

  beforeEach(module('sport.ng.templates'))
  beforeEach(module('sport.ng'))
  beforeEach(inject(function(_MockDirective_) { MockDirective = _MockDirective_ }))

  it('should use `percent` if passed in', function() {
    directive = new MockDirective('<div progress-bar percent="73" total="10" completed="4"></div>')
    expect(directive.$scope.progress()).toBe(73)
  })

  it('should calculate `percent` if not passed in', function() {
    directive = new MockDirective('<div progress-bar total="10" completed="4"></div>')
    expect(directive.$scope.progress()).toBe(40)
  })

  describe('pusher integration', function() {

    var channel
    var channelName = 'private-foo'

    beforeEach(function() {
      channel = MockPusher.channel(channelName)
    })

    afterEach(function() {
      MockPusher.reset()
    })

    it('accepts a pusher channel if passed as `remoteJob`', function() {
      directive = new MockDirective('<div progress-bar remote-job="jobInParentScope"></div>', {jobInParentScope: channel})
      expect(directive.$scope.channel).toBe(channel)
    })

    it('should connect to the correct pusher channel if passed a `remoteJobName` (channel name)', function() {
      directive = new MockDirective('<div progress-bar remote-job-name="'+channelName+'"></div>')
      expect(directive.$scope.channel).toBe(channel)
    })

  })

})