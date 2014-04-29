/*
Resource Manager

`config` should be in the following format

```
[{
  name: 'Tournament',
  url: '/api/tournaments/:id',  // For `url`, `paramDefaults`, `actions` and `options`
  paramDefaults: {}             // please refer to the ngResource documentation found here
  actions: {}                   // https://docs.angularjs.org/api/ngResource/service/$resource
  options: {}                   //
}]
```

*/

angular.module('sport.ng')
  .factory('ResourceManager', function($resource) {

    var ResourceManager = function(config) {
      // ensure that ResourceManager is called with `new`
      if (!(this instanceof ResourceManager))
        return new ResourceManager(config)

      // created $resource objects are cached
      var cache = {}

      config.forEach(function(conf) {
        if (!conf.name) throw new Error('Property "name" is required in resource config.')
        if (!conf.url) throw new Error('Property "url" is required in resource config.')

        // use a property getter so the $resource isn't created until it's needed
        Object.defineProperty(this, conf.name, {
          get: function() {
            if (!cache[conf.name]) // create it if not in cache
              cache[conf.name] = $resource(conf.url, conf.paramDefaults, conf.actions, conf.options)
            return cache[conf.name]
          },
          enumerable: true,
        })

      }.bind(this))
    }

    return ResourceManager

  })