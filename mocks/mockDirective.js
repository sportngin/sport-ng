'use strict'

angular.module('sport.ng')
  .factory('MockDirective', function($compile, $rootScope) {

    function MockDirective(tmpl, parentScope) {
      this.$parentScope = angular.extend($rootScope.$new(), parentScope|| {})
      if (this.defaultTemplate = tmpl) this.compile()
    }

    MockDirective.prototype.compile = function(tmpl) {
      if (!tmpl && !this.defaultTemplate) throw "Cannot compile mock directive without a template."
      this.$element = $compile(tmpl || this.defaultTemplate)(this.$parentScope)
      this.$parentScope.$digest()
      this.$scope = this.$element.isolateScope() || this.$element.scope()
    }

    return MockDirective

  })
