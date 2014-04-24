
describe('Route', function () {

  var LocationMock = function (initialUrl) {
    var _url = initialUrl || '';
    this.url = function (newUrl) {
      var result = newUrl ? _url = newUrl : _url;
      return result
    }
  }

  var route
  var routeNames = ['tournament.advancement', 'TournamentAdvancementController']

  beforeEach(module('sport.ng'))

  beforeEach(inject(function (Route) {
      route = Route
  }))

  describe('.urlFor()', function () {
    beforeEach(function () {
      spyOn(console, 'error')
    })

    // Testing route defined as:
    //
    //     .when('/tournaments/:id/advancement/:flightId?/:flightStageId?', {
    //       templateUrl: '/tournament/advancement/tournament-advancement.html',
    //       controller: 'TournamentAdvancementController as ctrl',
    //       name: 'tournament.advancement'
    //     })

    angular.forEach(routeNames, function(name) {
      it(name+': should build a url that omits optional route params', function () {
        var params = {id: 1}
        expect(route.urlFor(name, params)).toEqual('/tournaments/1/advancement')
      })

      it(name+': should build a url that omits certain optional route params', function () {
        var params = {id: 1, flightId: 2}
        expect(route.urlFor(name, params)).toEqual('/tournaments/1/advancement/2')
      })

      it(name+': should build a url using all route params (optional, required)', function () {
        var params = {id: 1, flightId: 2, flightStageId: 3}
        expect(route.urlFor(name, params)).toEqual('/tournaments/1/advancement/2/3')
      })

      it(name+': log an error to the console when a required route parameter is missing', function () {
        var params = {}
        expect(route.urlFor(name, params)).toEqual('/tournaments/:id/advancement')
        expect(console.error).toHaveBeenCalled()
      })

      it(name+': omit optional parameters that == null', function() {
        var params = {id: 1, flightId: null, flightStageId: undefined}
        expect(route.urlFor(name, params)).toEqual('/tournaments/1/advancement')
      })

      it(name+': omit optional empty string parameters', function() {
        var params = {id: 1, flightId: ''}
        expect(route.urlFor(name, params)).toEqual('/tournaments/1/advancement')
      })

      it(name+': other falsey parameters like 0 should make it through', function () {
        var params = {id: 0, flightId: 0}
        expect(route.urlFor(name, params)).toEqual('/tournaments/0/advancement/0')
      })

      it(name+': log an error when a required route parameter is omitted because it is == null', function () {
        var params = {id: null}
        expect(route.urlFor(name, params)).toEqual('/tournaments/:id/advancement')
        expect(console.error).toHaveBeenCalled()
      })
    })

  })

  describe('.update()', function (){
    var url, $location, $browser

    beforeEach(inject(function(_$location_, _$browser_) {
      $location = _$location_
      $browser = _$browser_
      spyOn($location, 'url').and.callFake(new LocationMock('/').url)
      url = '/tournaments/1/advancement'
      route.update(url)
    }))

    it('should update the route', function() {
      expect($location.url).toHaveBeenCalledWith(url)
    })

    it('should NOT update the route if we are already there.', function() {
      route.update(url)
      expect($location.url.calls.allArgs()).toEqual([[], [url], []])
    })
  })

  // describe('.updateCurrent()', function (){

  //   beforeEach(inject(function(_$httpBackend_, _$location_, _$rootScope_, _$route_) {
  //     $httpBackend = _$httpBackend_
  //     $location = _$location_
  //     $rootScope = _$rootScope_
  //     $route = _$route_

  //     // Setup initial route state for test(s)
  //     url = route.urlFor('tournament.advancement', {id: 1})
  //     $httpBackend.expect('GET', '/tournament/advancement/tournament-advancement.html').respond('')
  //     $location.url(url)
  //     $rootScope.$digest()
  //     expect($route.current.params.flightId)
  //       .toBe(undefined)
  //   }))

  //   it('should update the route with new params', function() {
  //     var newId = 'BOGUS_FLIGHT'

  //     route.updateCurrent({flightId: newId})

  //     expect($location.url).toBeCalledWith(url + '/BOGUS_FLIGHT')

  //     $httpBackend.flush()
  //   })
  // }) // END - updateCurrent()
})
