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

      config.forEach(function(conf) {
        if (!conf.name) throw new Error('Property "name" is required in resource config.')
        if (!conf.url) throw new Error('Property "url" is required in resource config.')

        Object.defineProperty(this, conf.name, {
          get: function() {
            if (!config.instance)
              config.instance = $resource(config.url, config.paramDefaults, config.actions, config.options)
            return config.instance
          },
          enumerable: true,
        })

      }.bind(this))
    }

    return ResourceManager

  })