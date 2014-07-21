/*
Deferred Script Directive

Defer loading of a script to prevent blocking
the main thread while it loads.

Usage:
  As an element:
    <deferred-script url="//example.com/path/to/script.js"></deferred-script>
  As an attribute on any other element:
    <span deferred-script url="//example.com/path.to/script.js"></span>
*/

'use strict'

angular.module('sport-ng')
  .directive('deferredScript', function deferredScriptDirective($document){
    function link (scope, elem, attrs) {
      var n = $document[0].getElementsByTagName('script')[0]
      var i = $document[0].createElement('script')
      i.src = scope.url
      n.parentNode.insertBefore(i, n)
    }
    return {
      restrict: 'AE',
      link: link,
      scope: {
        url: '='
      }
    }
  })
