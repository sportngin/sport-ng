'use strict';

angular.module('sport.ng')
  .directive('pagination', function paginationDirective(_) {

    return {
      restrict: 'E',
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

        $scope.$watch('totalPages', function(value) {
          setRange()
        })

        function setRange() {
          $scope.pageRange = _.range(1, $scope.totalPages + 1)
        }

        setRange()
      }
    }

  })
