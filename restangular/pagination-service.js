angular.module('sport.ng')
  .factory('PaginationService', function(_) {
    return {
      totalPages: function() {
        if (!this.metadata || !this.metadata.pagination) return null
        return this.metadata.pagination.total_pages
      },

      currentPage: function() {
        if (!this.metadata || !this.metadata.pagination) return null
        return this.metadata.pagination.current_page
      },

      limit: function() {
        if (!this.metadata || !this.metadata.pagination) return null
        return this.metadata.pagination.limit
      },

      getAll: function(params) {
        if (!params) params = {}
        _.omit(params, ['page', 'per_page'])
        return this.getList(_.extend(params, {page: 0}))
      }
    }
  })

angular.module('sport.ng')
  .factory('PaginationInterceptor', function() {
    return function(data, operation, what, url, response, deferred) {
      var extractedData
      if (operation === "getList") {
        extractedData = data.results
        extractedData.metadata = data.metadata
      } else {
        extractedData = data
      }
      return extractedData
    }
  })
