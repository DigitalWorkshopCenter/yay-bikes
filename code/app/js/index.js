require("font-awesome-webpack");
require('bulma');
require('../sass/index.sass');
var Catalog = require('./catalog');

/*
Example Catalog:
*/
var exampleCatalog = [
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
 * The overall state of our application.
 */
var state = {
  saleMarkupPercentage: 25,
  budget: 1000,
  profit: 0,
  catalog: [],
  inventory: [],
  sales: []
};


/**
 * Pretty print the state tree to the screen.
 */
var debugState = function(state) {
  var stateElement = document.getElementById('debugState');
  stateElement.innerText = JSON.stringify(state, null, '  ');
}

var displayBudget = function(state) {
  // TODO
  // 1. Get the budget out of the state

  // 2. Get a reference to the budget area of the web page

  // 3. Print the budget to the web page.
}

/**
 * Display the UI components based on the current state.
 */
var display = function(state) {
  debugState(state);
};

display(state);
