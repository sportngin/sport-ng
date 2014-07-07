'use strict'

angular.module('sport.ng')

  .directive('modal', function modalDirective($document, $controller, $compile, _) {

    var defaults = {
      attachment: 'middle center',
      targetAttachment: 'middle center',
      offset: '0 0',
      targetOffset: '0 0',
      dismissable: true
    }

    return {
      restrict: 'AE',
      scope: {
        'close': '&',
        'showing': '=',
        'classes': '='
      },
      transclude: true,
      templateUrl: '/bower_components/sport-ng/modal/modal.html',

      link: function link(scope, element, attrs) {
        // copy the options we care about
        var options = _.extend({}, defaults, _.omit(attrs, ['$$element', '$attr']))

        // show a close button when a close function is provided
        scope.closeButton = !!attrs.close

        // create a controller definition to use for the content
        var controllerAs = options.controllerAs || 'ctrl'
        var controller = angular.noop

        // setup tether options
        var tetherOpts = _.pick(options, ['attachment', 'targetAttachment', 'offset'])

        var popover = element.find('.popover')
        popover.addClass(scope.classes)

        // position the element
        var tether = new Tether(_.extend({
          element: popover,
          target: element.find('.overlay')
        }, tetherOpts))

        var content, currentScope
        var container = element.find('[ng-transclude]')
        var html = container.html()
        container.empty()

        // create a new modal element and attach it to the dom
        function show() {
          if (content) return

          // create new element, append it to the dom
          content = angular.element(html)
          container.append(content)

          // setup new scope and controller
          var currentScope = scope.$new()
          var ctrl = $controller(controller, { $scope: currentScope })
          currentScope[controllerAs] = ctrl

          // compile
          $compile(content)(currentScope)
          tether.position()
        }

        function hide() {
          if (!content) return
          container.empty()
          content = null
          currentScope = null
        }

        // watch the `showing` property and hide/show the modal accordingly
        scope.$watch('showing', function(newValue, oldValue) {
          if (newValue === oldValue) return
          if (newValue === true)
            show()
          else
            hide()
        })

        // make sure we clean up after ourselves
        scope.$on('$destroy', function() {
          hide()
          options = null
        })
      }
    }

  })
