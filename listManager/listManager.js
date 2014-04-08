sportng.ListManager = function ListManager(getItems) {

  this.getItems = getItems

  function addItem(item) {
    getItems().unshift(item)
  }

  function removeItem(item) {
    var list = getItems()
    list.splice(list.indexOf(item), 1)
  }

  function firstItem() {
    var list = getItems()
    if (!list || list.length < 1) return null
    return getItems()[0]
  }

  return {
    addItem: addItem,
    removeItem: removeItem,
    firstItem: firstItem,
    getItems: getItems
  }
}