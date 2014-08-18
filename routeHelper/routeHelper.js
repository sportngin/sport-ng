"use strict";

angular.module('sport.ng')
  .factory('Route', function($location, $route) {

    function RouteUrlException(message) {
       this.message = message;
       this.name = "RouteUrlException";
    }

    function startsWith(url) {
      // sidestep issues w/ 'anything'.indexOf(''): 0
      if (url === '') return false
      return $location.url().indexOf(url) === 0
    }

    function is(url) {
      return $location.url() === url
    }

    function nameIs(name) {
      var current = $route.current
      // Only compare if we have both names
      // (backwards compatability, undefined == undefined)
      if (name && current.name) {
        return current.name == name
      }
    }

    function update(url) {
      if (!is(url)) {
        $location.url(url)
      }
    }

    function updateCurrent(params) {
      var current = $route.current
      params = angular.extend({}, current.params, params)
      // *just* use $$route.originalPath ?
      var route = current.$$route.name || current.$$route.originalPath
      var newUrl = urlFor(route, params)
      update(newUrl)
    }

    function urlFor(routeName, params) {

      var findParams = /(\/)?:(\w+)([\?\*])?/g

      var replaceParams = function(_, slash, key, option){
        var result = ''
        try {
          var optional = option === '?'
          var val = params[key]
          // We need things like 0 to make it through
          if (val != null && val !== '') {
            result = slash + val
          } else if (!optional) {
            result = slash + ':' + key
            throw new RouteUrlException("Missing required parameter: '" + key + "'")
          }
        } catch (e) {
          console.error(e)
        } finally {
          return result
        }
      }

      for(var routePath in $route.routes) {
        var route = $route.routes[routePath]
        var controller = controllerName(route.controller)
        var name = route.name
        var routeFound = (controller == routeName || name == routeName)
        if(routeFound) {
          return routePath.replace(findParams, replaceParams)
        }
      }

      // No such controller in route definitions
      return undefined;
    }

    function controllerName(controller) {
      if(!controller) return controller
      return controller.split(/\s+as\s+/)[0]
    }

    return {
      startsWith: startsWith,
      is: is,
      nameIs: nameIs,
      urlFor: urlFor,
      update: update,
      updateCurrent: updateCurrent,
      RouteUrlException: RouteUrlException
    }

  })
