;(function(window) {
  
  angular.module('sport.ng').factory('PusherInstance', function(){
    return window.Pusher.instance = window.Pusher.instance || window.MockPusher.start()
  })

})(this);
