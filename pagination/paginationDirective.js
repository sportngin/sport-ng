'use strict';

angular.module('sport.ng')
  .directive('pagination', function paginationDirective() {

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

        $scope.$watch('totalPages', function(value) {
          setRange()
        })

        function setRange() {
          $scope.pageRange = []
          for (var i = 0; i < $scope.totalPages; i+=1) {
            $scope.pageRange[i] = i+1
          }
        }

        setRange()
      }
    }

  })
