var fixture = {
  results: [{id:1, name: 'foo'}, {id:2, name: 'bar'}],
  metadata: {pagination: {limit: 50, page: 1, total_pages: 2}}
}

var modelFixture = {id:1, name: 'foo'}

describe('PaginationService', function() {
  var restAngular, $httpBackend

  beforeEach(module('sport.ng'))

  beforeEach(inject(function($injector) {
    var Restangular = $injector.get('Restangular')
    var PaginationService = $injector.get('PaginationService')
    var PaginationInterceptor = $injector.get('PaginationInterceptor')

    restAngular = Restangular.withConfig(function(Configurer) {
      Configurer.addResponseInterceptor(PaginationInterceptor)
    })

    // Using $httpBackend mocks since PaginationInterceptor occurs within Restangular
    $httpBackend = $injector.get('$httpBackend')
  }))

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  })

  describe('PaginationInterceptor#getList', function(){

    beforeEach(function(){
      $httpBackend.whenGET('/mock').respond(fixture)
    })

    it('should extend collection with metadata when paginated', function(){
      $httpBackend.expectGET('/mock');
      restAngular.all('mock').getList().then(function(results){
        expect(results.metadata).toBeDefined()
        expect(results.metadata.pagination).toBeDefined()
        expect(results.metadata.pagination.page).toEqual(1)
        expect(results.metadata.pagination.limit).toEqual(50)
        expect(results.length).toEqual(2)
        expect(results.restangularCollection).toEqual(true)
      })
    })

    afterEach(function(){
      $httpBackend.flush()
    })
  })

  describe('PaginationInterceptor#get', function(){

    beforeEach(function(){
      $httpBackend.whenGET('/mock/1').respond(modelFixture)
    })

    it('should not extend collection with metadata when not paginated', function(){
      $httpBackend.expectGET('/mock/1');
      restAngular.one('mock', 1).get().then(function(result){
        expect(result.metadata).not.toBeDefined()
        expect(result.restangularCollection).toEqual(false)
        expect(result.name).toEqual(modelFixture.name)
      })
    })

    afterEach(function(){
      $httpBackend.flush()
    })
  })
})
