angular.module('sport.ng')
  .factory('PusherUtil', function (PusherInstance, $q, $timeout) {

    var deferredActionMap = {
      progress: 'notify',
      completed: 'resolve',
      errored: 'reject'
    }

    var promiseStateMap = {
      progress: 'inProgress',
      completed: 'completed',
      errored: 'errored'
    }

    function setPromiseState(promise, state) {
      for (var mappedEvent in promiseStateMap) {
        var mappedState = promiseStateMap[mappedEvent]
        promise[mappedState] = mappedState === state
      }
    }

    function setPromiseThenTrigger(scope, prop, eventName) {
      return function(data) {
        var dfd = $q.defer()
        var action = deferredActionMap[eventName]
        var promiseState = promiseStateMap[eventName]
        scope.$apply(function() {
          var promise = scope[prop] = dfd.promise
          setPromiseState(promise, promiseState)
        })
        $timeout(function(){
          dfd[action](data)
        })
      }
    }

    function channel(channel) {
      if (typeof channel === 'string') channel = PusherInstance.channel(channel) || PusherInstance.subscribe(channel)
      return channel
    }

    function setPromiseOnData(scope, channel, promiseProp) {
      channel = api.channel(channel)

      if (!scope || !channel) throw "Cannot bind promise without scope and channel."

      channel.bind('progress', setPromiseThenTrigger(scope, promiseProp, 'progress'))
      channel.bind('completed', setPromiseThenTrigger(scope, promiseProp, 'completed'))
      channel.bind('errored', setPromiseThenTrigger(scope, promiseProp, 'errored'))
    }

    var api = {
      channel: channel,
      setPromiseOnData: setPromiseOnData
    }

    return api

  })
