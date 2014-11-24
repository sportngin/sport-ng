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

    function confirm(instance) {
      var promise = config.confirm()
      if (promise && promise.then) return promise.then(cancel.bind(null, instance))
      else cancel(instance)
    }

    function cancel(instance) {
      config.name = null
      config.type = null
      config.confirm = null
      config.dangerZone = false
      config.showing = false
      instance.typeName = ''
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

        this.cancel = ConfirmDelete.cancel.bind(null, this)
        this.confirm = ConfirmDelete.confirm.bind(null, this)
      }
    }

  })
