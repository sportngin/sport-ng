var items = [
  {"id":1,"name":"Football"},
  {"id":3,"name":"Ice Hockey"},
  {"id":6,"name":"Baseball"}
]

describe('ListManager', function() {

  var list,
      itemCount = 0,
      newItem = {"id":8,"name":"Soccer"}

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


    beforeEach(function() {
      itemCount = items.length
      list.addItem(newItem)
    })

    it('should add the item to the top of the list', function() {
      expect(list.firstItem()).toEqual(newItem)
    })

    it('should increase the item count', function() {
      expect(list.getItems().length).toEqual(itemCount+1)
    })

  })

  describe('ListManager#removeItem', function() {

    var item = items[0]

    beforeEach(function() {
      itemCount = items.length
      list.removeItem(item)
    })

    it('should remove the item from the list', function() {
      expect(list.getItems().indexOf(item)).toEqual(-1)
    })

    it('should decrease the item count', function() {
      expect(list.getItems().length).toEqual(itemCount-1)
    })

  })

  describe('ListManager#firstItem', function() {

    var firstItem = items[0]

    var emptyList = sportng.ListManager(function() {
          return []
        })

    var nullList = sportng.ListManager(function() {
          return null
        })

    it('should return the first item in the list', function() {
      expect(list.firstItem()).toBe(list.getItems()[0])
    })

    it('should return null when list is empty', function() {

      expect(emptyList.firstItem()).toBe(null)
    })

    it('should return null when list is null', function() {
      expect(nullList.firstItem()).toBe(null)
    })

  })

})