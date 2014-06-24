/*

Defer the loading and execution of a script tag

Usage:
  Element: <deferred url="//google-analytics.com/ga.js"/>
  Attribute: <div deferred url="//google-analytics.com/ga.js"></div>

*/

angular.module('sport.ng')
  .directive('deferred', function deferredDirective($document){
    'use strict'
    return {
      restrict: 'AE',
      scope: {
        url: '='
      },
      link: function (scope, elem, attrs) {
        var n = $document[0].getElementsByTagName('script')[0]
        var i = $document[0].createElement('script')
        i.src = scope.url
        n.parentNode.insertBefore(i, n)
      }
    }
  })
