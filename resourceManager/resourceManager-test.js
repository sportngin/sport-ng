var resourceConfig = [
  {
    name: 'Tourney',
    url: '/api/tourney/:tourneyID',
    paramDefaults: { tourneyID: '@id' },
    actions: { get: {method:'GET'} },
    options: {}
  }
]

describe('ResourceManager', function() {

  var api, resSpy

  angular.module('sport.ng').factory('$resource', function() {
    return resSpy = jasmine.createSpy('resSpy').and.returnValue({})
  })

  beforeEach(module('sport.ng'))

  beforeEach(inject(function(ResourceManager) {
    api = ResourceManager(resourceConfig)
    resSpy.calls.reset()
  }))

  describe('ResourceManager#constructor', function() {

    it('should create a "Tourney" property', function() {
      expect(!!api.Tourney).toBe(true)
    })

    it('should call $resource with the config properties', function() {
      var x = api.Tourney // run the getter
      var t = resourceConfig[0]
      expect(resSpy).toHaveBeenCalledWith(t.url, t.paramDefaults, t.actions, t.options)
    })

    it('should call $resource only once per service', function() {
      expect(resSpy.calls.count()).toBe(0)
      var x = api.Tourney
      expect(resSpy.calls.count()).toBe(1)
      var y = api.Tourney
      expect(resSpy.calls.count()).toBe(1)
      expect(x).toBe(y)
    })

  })

})