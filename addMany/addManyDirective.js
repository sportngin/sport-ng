/*
Add Many directive

Usage:
  <add-many
    save="someSaveFunc()"
    cancel="someCancelFunc()"
    template-url="/path/to/template.html"
    save-button-text="Some Text"></add-many>

Save:
  The save function is passed the array of items
  added via the form.

Cancel:
  The `cancel` function is called when the cancel button is pressed.

*/

'use strict'

angular.module('sport.ng')
  .directive('addMany', function addManyDirective() {

    return {
      restrict: 'AE',
      scope: {
        'cancel': '&',
        'save': '&',
        'saveButtonText': '@'
      },
      controllerAs: 'ctrl',

      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || '/bower_components/sport-ng/addMany/addMany.html'
      },

      controller: function($scope) {
        this.items = [{}]
        this.saveButtonText = $scope.saveButtonText

        this.cancel = function() {
          this.items = [{}]
          $scope.cancel()
        }

        this.saving = false
        this.save = function(items) {
          this.saving = true
          $scope.save(items)
        }

        // add another item if the last item has text
        this.addBlankItem = function() {
          this.items.push({})
        }

        // remove an item fromt he array at the given index
        this.removeItem = function(idx) {
          this.items.splice(idx, 1)
        }
      }
    }

  })
