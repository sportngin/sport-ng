'use strict';

angular.module('sport.ng')
  .directive('pagination', function paginationDirective(_) {

    return {
      restrict: 'AE',
      scope: {
        getPage: '&',
        totalPages: '=',
        currentPage: '='
      },
      controllerAs: 'ctrl',

      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || '/bower_components/sport-ng/pagination/pagination.html'
      },

      controller: function($scope) {
        this.getPage = function(page) {
          if (page != $scope.currentPage)
            $scope.getPage({page:page})
        }

        $scope.$watch('totalPages', setRange)

        function setRange(total) {
          if (total == null) total = 0
          $scope.pageRange = _.range(1, total + 1)
        }

        setRange()
      }
    }

  })
