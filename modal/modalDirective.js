'use strict'

angular.module('sport.ng')

  .directive('modal', function modalDirective($document, $controller, $compile, $timeout, _) {

    var defaults = {
      attachment: 'middle center',
      targetAttachment: 'middle center',
      offset: '150px 0',
      targetOffset: '0 0',
      dismissable: true,
      optimizations: {
        gpu: false // allows us to use css animations
      }
    }

    return {
      restrict: 'AE',
      scope: {
        'close': '&',
        'showing': '=',
        'classes': '=',
        'dangerZone': '='
      },
      transclude: true,
      templateUrl: '/bower_components/sport-ng/modal/modal.html',

      link: function link(scope, element, attrs) {
        // copy the options we care about
        var options = _.extend({}, defaults, _.omit(attrs, ['$$element', '$attr']))

        // setup tether options
        var tetherOpts = _.pick(options, ['attachment', 'targetAttachment', 'offset', 'optimizations'])

        var popover = element.find('.popover')
        popover.addClass(scope.classes)

        if (attrs.dangerZone) popover.addClass('danger-zone')

        if (attrs.close) {
          var closeButton = $('<button ng-click="close()" class="right media no-style"><span class="icon sm multiply"></span></button>')
          $compile(closeButton)(scope)
          popover.prepend(closeButton)
        }

        // position AND YANK the element
        // (existing angular bindings will stay in place after yanking the element)
        var tether = new Tether(_.extend({
          element: popover,
          target: element.find('.overlay')
        }, tetherOpts))

        // create a new modal element and attach it to the dom
        function position() {
          // Give angular time to show / hide things
          $timeout(tether.position.bind(tether))
        }

        // watch the `showing` property and hide/show the modal accordingly
        scope.$watch('showing', function(newValue, oldValue) {
          if (newValue === oldValue) return
          if (newValue === true)
            position()
        })

        // make sure we clean up after ourselves
        scope.$on('$destroy', function() {
          popover.remove()
          options = null
        })
      }
    }

  })
