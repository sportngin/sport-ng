describe('Alerts Service', function() {

  beforeEach(module('sport.ng'))

  it('should have `alerts` array.', inject(function(Alerts) {
    expect(Alerts.alerts).toEqual([])
  }))

  it('should add alert to alerts array with `show`.', inject(function(Alerts) {
    Alerts.show('info', 'message')
    var alert = Alerts.alerts[0]
    expect(alert.type).toEqual('info')
    expect(alert.message).toEqual('message')
  }))


  describe('Alerts.show arguments', function() {

    it('should accept optional `options` argument as an object.', inject(function(Alerts) {
      var opts = { x:1 }
      Alerts.show('info', 'msg', opts)
      var alert = Alerts.alerts[0]
      expect(alert.options).toEqual(opts)
    }))

    it('should default `dismissable` to true.', inject(function(Alerts) {
      Alerts.show('info', 'msg')
      var alert = Alerts.alerts[0]
      expect(alert.dismissable).toEqual(true)
    }))

    it('should accept optional `dismissable` argument as a boolean.', inject(function(Alerts) {
      var opts = { x:1 }
      Alerts.show('info', 'msg', false)
      var alert = Alerts.alerts[0]
      expect(alert.dismissable).toEqual(false)
    }))

  })


  describe('Alerts.show duration', function() {

    it('should set timer for automatic removal of alert', inject(function(Alerts, $timeout) {
      Alerts.show('info', 'msg')
      expect(Alerts.alerts.length).toEqual(1)
      $timeout.flush()
      expect(Alerts.alerts.length).toEqual(0)
    }))

    it('should not remove when duration set to zero.', inject(function(Alerts, $timeout) {
      Alerts.show('info', 'msg', 0)
      var alert = Alerts.alerts[0]
      expect(alert._timer).toBeFalsy()
    }))

  })


  describe('Alerts.show aliases', function() {

    it('should add alert to alerts array with `info`.', inject(function(Alerts) {
      Alerts.info('message')
      var alert = Alerts.alerts[0]
      expect(alert.type).toEqual('info')
    }))

    it('should add alert to alerts array with `success`.', inject(function(Alerts) {
      Alerts.success('message')
      var alert = Alerts.alerts[0]
      expect(alert.type).toEqual('success')
    }))

    it('should add alert to alerts array with `error`.', inject(function(Alerts) {
      Alerts.error('message')
      var alert = Alerts.alerts[0]
       expect(alert.type).toEqual('error')
    }))

    it('should add alert to alerts array with `warning`.', inject(function(Alerts) {
      Alerts.warning('message')
      var alert = Alerts.alerts[0]
      expect(alert.type).toEqual('warning')
    }))

  })


  describe('Alerts.remove', function() {

    it('should remove the alert', inject(function(Alerts) {
      Alerts.info('message')
      expect(Alerts.alerts.length).toEqual(1)
      Alerts.remove(Alerts.alerts[0])
      expect(Alerts.alerts.length).toEqual(0)
    }))

    it('should not error when removing an alert with 0 duration', inject(function(Alerts) {
      Alerts.info('message', 0)
      expect(Alerts.alerts.length).toEqual(1)
      Alerts.remove(Alerts.alerts[0])
      expect(Alerts.alerts.length).toEqual(0)
    }))

  })

})


// describe('Alerts Directive', function() {

//   var $scope, Alerts, element

//   beforeEach(module('sport.ng'))

//   beforeEach(function() {
//     angular.mock.module(function($provide) {

//       $provide.factory('Alerts', function() {
//         var alerts = []
//         return {
//           alerts:alerts,
//           show: function(t, m) { alerts.push({type:t, message:m})},
//           remove:function(a){}
//         }
//       })
//     })
//     // angular.module('Test', ['SportNgin', 'Mocks'])

//     inject(['$compile', '$rootScope', '$httpBackend', 'Alerts',
//       function($compile, $rootScope, $httpBackend, a) {
//         $httpBackend.expectGET('/components/alerts/alerts.html').respond(200, '<div></div>')

//         element = angular.element('<alerts></alerts>')
//         $compile(element)($rootScope)
//         $rootScope.$digest()
//         $scope = $rootScope
//         Alerts = a
//       }])
//   })

//   it("should show alerts", function() {
//     assert.equal(element.children('div').length, 0, 'should have no children')
//     Alerts.show('info', 'message')
//     assert.equal(element.children('div').length, 1, 'should have one child')
//   })

// })