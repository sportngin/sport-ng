var items = [
  {"id":1,"name":"Football","ngin_sport_id":11},
  {"id":3,"name":"Ice Hockey","ngin_sport_id":1},
  {"id":6,"name":"Baseball","ngin_sport_id":4}
]

describe('ListManager', function() {
  var list

  beforeEach(module('sport.ng'))

  beforeEach(function() {
    var getItems = function() {
      return items
    }
    list = sportng.ListManager(getItems)
  })

  describe('ListManager#contructor', function() {

    it('should initialize the getItems function', function() {
      expect(list.getItems()).toEqual(items)
    })

  })

  describe('ListManager#addItem', function() {

    var itemCount = 0
    var newItem = {"id":8,"name":"Soccer","ngin_sport_id":4}

    beforeEach(function() {
      itemCount = list.getItems().length
      list.addItem(newItem)
    })

    it('should add the item to the top of the list', function() {
      expect(list.firstItem()).toEqual(newItem)
    })

    it('should increase the item count', function() {
      expect(list.getItems().length).toEqual(itemCount+1)
    })

  })

  // describe('ListManager#removeItem', function() {

  //   var itemCount = 0

  //   beforeEach(function() {
  //     itemCount = list.getItems().length
  //     list.removeItem(items[0])
  //   })

  //   it('should add the item to the top of the list', function() {
  //     expect(list.firstItem()).toEqual(newItem)
  //   })

  //   it('should decrease the item count', function() {
  //     expect(list.getItems().length).toEqual(itemCount+1)
  //   })

  // })

})