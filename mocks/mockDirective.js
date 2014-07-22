'use strict'

angular.module('sport.ng')
  .factory('MockDirective', function($compile, $location, $rootScope) {

    function MockDirective(tmpl, parentScope) {
      this.$location = $location
      this.$parentScope = angular.extend($rootScope.$new(), parentScope|| {})
      if (this.defaultTemplate = tmpl) this.compile()
    }

    MockDirective.prototype.compile = function(tmpl) {
      if (!tmpl && !this.defaultTemplate) throw "Cannot compile mock directive without a template."
      this.$element = $compile(tmpl || this.defaultTemplate)(this.$parentScope)
      this.$scope = this.$element.scope()
      this.$parentScope.$digest()
      this.$isolateScope = this.$element.isolateScope()
    }

    return MockDirective

  })
