
ddescribe('ProgressNotification', function() {

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

    it('should display as a success notification on `completed`', function() {
      directive = new MockDirective('<div class="warning" progress-notification remote-job-name="'+channelName+'"></div>')
      spyOn(directive.$scope, '$destroy')

      jasmine.clock().install()

      channel.emit('completed', {})
      expect(directive.$element.hasClass('success')).toBe(false)
      jasmine.clock().tick(501) // css animation takes 500ms
      expect(directive.$element.hasClass('success')).toBe(true)
      expect(directive.$element.hasClass('warning')).toBe(false)

      jasmine.clock().uninstall()
    })

    it('should display as an error notification on `errored`', function() {
      directive = new MockDirective('<div class="warning" progress-notification remote-job-name="'+channelName+'"></div>')
      spyOn(directive.$scope, '$destroy')

      jasmine.clock().install()

      channel.emit('errored', {})
      expect(directive.$element.hasClass('error')).toBe(true)
      expect(directive.$element.hasClass('warning')).toBe(false)

      jasmine.clock().uninstall()
    })


  })

})