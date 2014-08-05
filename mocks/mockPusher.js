;(function(exports){

  // Pusher must alredy be loaded
  var RealPusher = exports.Pusher
  var Util = RealPusher.Util

  /**
   * Stub Pusher object.
   */
  var Pusher = function(appKey, options) {
    Pusher.instances.push(this);
    
    this.connection = new Connection();
  
    this._channels = {};
  };

  /**
   * Gets the channel with the given channel name.
   * @param {String} The name identifying the channel to be retrieved.
   *
   * @return {RealPusher.test.framework.Channel} a stub channel object.
   */ 
  Pusher.prototype.channel = function(channelName) {
    return this._channels[channelName];
  };

  /**
   * Provides access to all Pusher instances.
   * @type Array
   */
  Pusher.instances = [];
  
  /** required for the Flash fallback */
  Pusher.ready = function() {}

  /**
   * Accesses the first Pusher Stub instance and dispatches an event on a channel.
   *
   * @param {String} channelName The name of the channel the event should be triggered on.
   * @param {String} eventName the name of the even to be triggered on the channel
   * @param {String} eventData the data to be sent with the event.
   */
  Pusher.dispatch = function(channelName, eventName, eventData) {
    var instance = Pusher.instances[0];
    var channel = instance.channel(channelName);
    channel.dispatch(eventName, eventData);
  }

  /**
   * Creates a new Pusher object on the root scope.
   *
   * @param {String} channelName The name of the channel the event should be triggered on.
   */
  Pusher.start = function() {
    return exports.Pusher.instance = new Pusher()
  }

  /**
   * Creates a new Pusher instance and a channel with the given channelName.
   *
   * @param {String} channelName The name of the channel the event should be triggered on.
   */
  Pusher.channel = function(channelName) {
    var instance = Pusher.start()
    return instance.channel(channelName) || instance.subscribe(channelName)
  }

  /**
   * Resets the internal pusher instances array.
   *
   * @param {String} channelName The name of the channel the event should be triggered on.
   */
  Pusher.reset = function() {
    Pusher.instances.splice(0)
    exports.Pusher.instance = null
  }

  /**
   * Subscribe to a channel.
   * @return {RealPusher.test.framework.Channel} A stub channel object.
   */
  Pusher.prototype.subscribe = function(channelName) {
    var channel = new Channel(channelName);
    this._channels[channelName] = channel;
    return channel;
  };

  /**
   * Not implemented.
   */
  Pusher.prototype.unsubscribe = function(channelName) {
    throw "not implemented";
  }

  /**
   * A stub channel object.
   * @extends EventsDispatcher
   */
  var Channel = function(name) {
    RealPusher.EventsDispatcher.call(this);
  
    this.name = name;
  };
  Util.extend(Channel.prototype, RealPusher.EventsDispatcher.prototype);
  
  var Connection = function() {
    RealPusher.EventsDispatcher.call(this);
    
    this.state = undefined;
  };
  Util.extend(Connection.prototype, RealPusher.EventsDispatcher.prototype);

  /**
   * Stub object of the event object passed to the
   * pusher:subscription-succeeded event callback.
   * Represents a collection of members subscribed to a presence channel.
   */
  var Members = function() {
    this._members = {};
  
    /**
     * The number of members in the collection.
     *
     * @type Number
     */
    this.count = 0;
  };

  /**
   * Provides a way of adding members to the members collection.
   *
   * @param {Object} Object should have an 'id' and 'info' property as follows:
   *    {
   *      "id": "Unique_user_id",
   *      "info": {
   *        "any" : "thing" // any number of properties on this object
   *      }
   *    }
   *
   * @return The member object parameter that was passed in
   */
  Members.prototype.add = function(member) {
    this._members[member.id] = member;
    ++this.count;
    return member;
  };

  /**
   * Used to loop through the members within the collection.
   * @param {Function} callback A callback to be executed for each member found within
   *  the collection.
   */
  Members.prototype.each = function(callback) {
    for(var id in this._members) {
      callback(this._members[id]);
    }
  };
  
  exports.MockPusher = Pusher;
  exports.Members = Members; // not sure what this is, but i'm not comfortable removing it since we might need it at some point - JH

})(this);
