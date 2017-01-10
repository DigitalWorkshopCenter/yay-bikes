var productList = [
  {
    id: 1,
    name: "Gloves",
    price: 25
  },
  {
    id: 2,
    name: "Shorts",
    price: 75
  },
  {
    id: 3,
    name: "Jersey",
    price: 55
  },
  {
    id: 4,
    name: "Trek Mountain Bike",
    price: 250
  },
  {
    id: 5,
    name: "Cannondale Road Bike",
    price: 650
  }
];


/**
 * A collection of functions that manage the
 * products available from the supplier.
 */
var Supplier = {

  /**
   * Returns a list of products that are
   * provided by the supplier.
   */
  productList: function() {
    return productList;
  }

};

module.exports = Supplier;
