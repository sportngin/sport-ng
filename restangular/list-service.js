angular.module('sport.ng')
  .factory('ListService', function() {
    return {
      prepend: function(object) {
        return this.unshift(object)
      },

      append: function(object) {
        return this.push(object)
      },

      remove: function(object) {
        return this.splice(this.indexOf(object), 1)
      }
    }
  })
