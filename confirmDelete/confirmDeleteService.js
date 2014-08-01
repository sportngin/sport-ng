'use strict';

angular.module('sport.ng')
  .factory('ConfirmDelete', function confirmDeleteService() {
    var config = {}

    function show(name, type, dangerZone, confirm) {
      // dangerZone is optional and defaults to false
      if (typeof dangerZone == 'function')
        confirm = dangerZone, dangerZone = false

      config.name = name
      config.type = type
      config.dangerZone = dangerZone
      config.confirm = confirm
      config.showing = true
    }

    function confirm() {
      config.confirm()
      cancel()
    }

    function cancel() {
      config.name = null
      config.type = null
      config.confirm = null
      config.dangerZone = false
      config.showing = false
    }

    return {
      show: show,
      confirm: confirm,
      cancel: cancel,
      config: config
    }
  })
  .directive('confirmDelete', function confirmDeleteDirective(ConfirmDelete) {

    return {
      restrict: 'AE',
      scope: {},
      controllerAs: 'ctrl',

      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || '/bower_components/sport-ng/confirmDelete/confirmDelete.html'
      },

      controller: function confirmDeleteController($scope) {
        this.config = ConfirmDelete.config
        this.config.options = {
          name: this.config.name,
          type: this.config.type
        }

        this.cancel = function() {
          ConfirmDelete.cancel()
          this.typeName = ''
        }

        this.confirm = function() {
          ConfirmDelete.confirm()
          this.typeName = ''
        }
      }
    }

  })
