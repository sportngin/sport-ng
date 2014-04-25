
describe('Route', function () {

  var LocationMock = function (initialUrl) {
    var _url = initialUrl || '';
    this.url = function (newUrl) {
      var result = newUrl ? _url = newUrl : _url;
      return result
    }
  }

  var route, $routeProvider
  var routeNames = ['tournament.advancement', 'TournamentAdvancementController']

  beforeEach(module('sport.ng'))

  beforeEach(inject(function (Route, _$route_) {
      route = Route
      $route = _$route_
      $route.routes = {
        '/tournaments/:id/advancement/:flightId?/:flightStageId?': {
          reloadOnSearch:true,
          templateUrl:"/tournament/advancement/tournament-advancement.html",
          controller:"TournamentAdvancementController as ctrl",
          name:"tournament.advancement",
          originalPath:"/tournaments/:id/advancement/:flightId?/:flightStageId?",
          regexp:/^\/tournaments\/(?:([^\/]+))\/advancement(?:\/([^\/]+)?)?(?:\/([^\/]+)?)?$/,
          keys:[{name:"id", optional:false}, {name:"flightId", optional:true}, {name:"flightStageId", optional:true}]
        }
      }
  }))

  describe('.urlFor()', function () {
    beforeEach(function () {
      spyOn(console, 'error')
    })

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

})
