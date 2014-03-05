var assert = chai.assert

describe('Alerts Service', function() {

  beforeEach(module('sport.ng'))

  it('should have `alerts` array.', inject(['Alerts', function(Alerts) {
    assert.isArray(Alerts.alerts, 'alerts should be an array')
  }]))

  it('should add alert to alerts array with `show`.', inject(['Alerts', function(Alerts) {
    Alerts.show('info', 'message')
    var alert = Alerts.alerts[0]
    assert.equal(alert.type, 'info', 'alert type should be info')
    assert.equal(alert.message, 'message', 'alert message should be message')
  }]))


  describe('Alerts.show arguments', function() {

    it('should accept optional `options` argument as an object.', inject(['Alerts', function(Alerts) {
      var opts = { x:1 }
      Alerts.show('info', 'msg', opts)
      var alert = Alerts.alerts[0]
      assert.equal(alert.options, opts, 'alert options should match passed options')
    }]))

    it('should default `dismissable` to true.', inject(['Alerts', function(Alerts) {
      Alerts.show('info', 'msg')
      var alert = Alerts.alerts[0]
      assert.strictEqual(alert.dismissable, true, 'dismissable should be true')
    }]))

    it('should accept optional `dismissable` argument as a boolean.', inject(['Alerts', function(Alerts) {
      var opts = { x:1 }
      Alerts.show('info', 'msg', false)
      var alert = Alerts.alerts[0]
      assert.strictEqual(alert.dismissable, false, 'dismissable should be false')
    }]))

  })


  describe('Alerts.show duration', function() {

    it('should set timer for automatic removal of alert', function() {
      inject(['Alerts', '$timeout', function(Alerts, $timeout) {
        Alerts.show('info', 'msg')
        assert.strictEqual(Alerts.alerts.length, 1, 'Alert should exist.')
        $timeout.flush()
        assert.strictEqual(Alerts.alerts.length, 0, 'Alert should have been removed.')
      }])
    })

    it('should not remove when duration set to zero.', function() {
      inject(['Alerts', '$timeout', function(Alerts, $timeout) {
        Alerts.show('info', 'msg', 0)
        var alert = Alerts.alerts[0]
        assert.notOk(alert._timer, 'Alert timer should not exist.')
      }])
    })

  })


  describe('Alerts.show aliases', function() {

    it('should add alert to alerts array with `info`.', inject(['Alerts', function(Alerts) {
      Alerts.info('message')
      var alert = Alerts.alerts[0]
      assert.equal(alert.type, 'info', 'alert type should be info')
    }]))

    it('should add alert to alerts array with `success`.', inject(['Alerts', function(Alerts) {
      Alerts.success('message')
      var alert = Alerts.alerts[0]
      assert.equal(alert.type, 'success', 'alert type should be success')
    }]))

    it('should add alert to alerts array with `error`.', inject(['Alerts', function(Alerts) {
      Alerts.error('message')
      var alert = Alerts.alerts[0]
      assert.equal(alert.type, 'error', 'alert type should be error')
    }]))

    it('should add alert to alerts array with `warning`.', inject(['Alerts', function(Alerts) {
      Alerts.warning('message')
      var alert = Alerts.alerts[0]
      assert.equal(alert.type, 'warning', 'alert type should be warning')
    }]))

  })


  describe('Alerts.remove', function() {

    it('should remove the alert', inject(['Alerts', function(Alerts) {
      Alerts.info('message')
      assert.strictEqual(Alerts.alerts.length, 1, 'one alert should exist')
      Alerts.remove(Alerts.alerts[0])
      assert.strictEqual(Alerts.alerts.length, 0, 'no alert should exist')
    }]))

    it('should not error when removing an alert with 0 duration', inject(['Alerts', function(Alerts) {
      Alerts.info('message', 0)
      assert.strictEqual(Alerts.alerts.length, 1, 'one alert should exist')
      Alerts.remove(Alerts.alerts[0])
      assert.strictEqual(Alerts.alerts.length, 0, 'no alert should exist')
    }]))

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