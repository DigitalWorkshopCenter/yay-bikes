require("font-awesome-webpack");
require('bulma');
require('../sass/index.sass');
var Catalog = require('./catalog');

/**
 * The overall state of our application.
 */
var state = {
  saleMarkupPercentage: 25,
  budget: 1000,
  profit: 0,
  productList: [],
  inventory: [],
  sales: []
};


/**
 * Utility function for creating DOM elements.
 */
var tag = function(tagName, options = {}) {
  var element = document.createElement(tagName);
  for (var key in options) {
    switch(key) {
      case 'className':
        element.setAttribute('class', options[key]);
        break;
      default:
        break; // do nothing
    }
  }
  return element;
}


/**
 * Close the sale modal by removing the is-active class.
 */
var closeSale = function() {
  var saleModal = document.getElementById('saleModal');
  saleModal.className =
    saleModal.className
      .replace('is-active', '')
      .trim();

  // Make sure we remove the pending sale from our main application state!
  state.pendingSale = null
  display(state);
}


/**
 * Close the new catalog item modal by removing the is-active class.
 */
var closeNewCatalogItem = function() {
  var saleModal = document.getElementById('newCatalogItemModal');
  saleModal.className =
    saleModal.className
      .replace('is-active', '')
      .trim();

  // Reset the form
  document.getElementById('newItemName').value = '';
  document.getElementById('newItemPrice').value = '';
}


/**
 * Show the new catalog item form.
 */
var newCatalogItem = function() {
  var newCatalogItemModal = document.getElementById('newCatalogItemModal');
  newCatalogItemModal.className += ' is-active';
}


/**
 * One-off set up of event handler for the newCatalogItemButton.
 */
var setupNewCatalogItemButton = function() {
  var newCatalogItemButton = document.getElementById('newCatalogItemButton');
  newCatalogItemButton.addEventListener('click', newCatalogItem);
}


/**
 * One-off set up of event handlers for the cancel-new-catalog-item buttons.
 */
var setupCloseNewCatalogItemButton = function() {
  // Attach the close modal event handler to all the elements
  // with the cancel-sale class.
  var cancelNewCatalogItemElements =
    document.getElementsByClassName('cancel-new-catalog-item');

  // document.getElementsByClassName returns an HTMLCollection
  //  See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
  //
  // We use a function on Array's prototype to operate on the HTMLCollection
  // in an array-like manner.
  Array.prototype.forEach.call(cancelNewCatalogItemElements, function(elem) {
    elem.addEventListener('click', closeNewCatalogItem);
  });
}


/**
 * One-off set up of event handlers for the cancel-sale buttons.
 */
var setupCancelSaleButtons = function() {
  // Attach the close modal event handler to all the elements
  // with the cancel-sale class.
  var cancelSaleElements = document.getElementsByClassName('cancel-sale');

  // document.getElementsByClassName returns an HTMLCollection
  //  See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
  //
  // We use a function on Array's prototype to operate on the HTMLCollection
  // in an array-like manner.
  Array.prototype.forEach.call(cancelSaleElements, function(elem) {
    elem.addEventListener('click', closeSale);
  });
}


var validateNewItemName = function() {
  var newItemNameInput = document.getElementById('newItemName');
  var newItemValue = newItemNameInput.value;
  var isValid;
  if (newItemValue.length < 3) {
    isValid = false;
    newItemNameInput.className =
      newItemNameInput.className
        .replace('is-success', '')
        .trim();
    newItemNameInput.className += ' is-danger';
  } else {
    isValid = true;
    newItemNameInput.className =
      newItemNameInput.className
        .replace('is-danger', '')
        .trim();
    newItemNameInput.className += ' is-success';
  }
  return isValid;
}


var validateNewItemPrice = function() {
  var newItemPriceInput = document.getElementById('newItemPrice');
  var newItemValue = newItemPriceInput.value;
  var isValid;
  if (newItemValue < 1) {
    isValid = false;
    newItemPriceInput.className =
      newItemPriceInput.className
        .replace('is-success', '')
        .trim();
    newItemPriceInput.className += ' is-danger';
  } else {
    isValid = true;
    newItemPriceInput.className =
      newItemPriceInput.className
        .replace('is-danger', '')
        .trim();
    newItemPriceInput.className += ' is-success';
  }
  return isValid;
}


/**
 *
 */
var validateNewCatalogItemForm = function() {
  var nameIsValid = validateNewItemName();
  var priceIsValid = validateNewItemPrice();

  var allFieldsAreValid =
    nameIsValid &&
    priceIsValid;

  return allFieldsAreValid;
}


var nextProductId = function(state) {
  var reducer = function(prev, curr, index, arr) {
    if (curr.id > prev) {
      return curr.id;
    } else {
      return prev;
    }
  }
  var startWith = 1;
  var highestId = state.productList.reduce(reducer, startWith);
  var nextId = highestId + 1;
  return nextId;
}


/**
 * Validates the new catalog item form and adds a new item to the catalog.
 */
var addToCatalog = function() {
  if (validateNewCatalogItemForm()) {
    // Create a new item from the form
    var newItemNameInput = document.getElementById('newItemName');
    var newItemPriceInput = document.getElementById('newItemPrice');
    var newItem = {
      id: nextProductId(state),
      name: newItemNameInput.value,
      price: parseInt(newItemPriceInput.value)
    }
    state.productList.push(newItem);
    closeNewCatalogItem();
    display(state);
  }
}

/**
 * Validate the new catalog item form and add to the catalog if valid.
 * Display an error message if invalid.
 */
var setupProcessNewCatalogItemButton = function() {
  var addToCatalogButton = document.getElementById('addToCatalog');
  addToCatalogButton.addEventListener('click', addToCatalog);
}


/**
 * One-off set up of the event handler for the process sale
 * "Charge it!" button.
 */
var setupProcessSaleButton = function(state) {
  var chargeItElement = document.getElementById('chargeIt');

  var chargeIt = function() {
    var pendingSale = state.pendingSale;
    if (pendingSale) {
      var profit = pendingSale.total - pendingSale.product.price;
      state.budget += pendingSale.total;
      state.profit += profit;
      state.pendingSale = null;
      state.inventory = removeFromInventory(pendingSale.product);
      state.sales.push(pendingSale);

      closeSale();
      display(state);
    }
  }

  chargeItElement.addEventListener('click', chargeIt);
}


/**
 * Sell the given product. This will alter the main
 * application state appropriately.
 *
 * Exercise: prevent buying more inventory if the current inventory status
 * is TOO HIGH.
 */
var buyProduct = function(state, product) {
  var inventory = state.inventory;

  if (state.budget >= product.price) {
    var existingInventory = inventory.find(x => x.product.id === product.id);
    if (existingInventory) {
      existingInventory.quantity += 1;
    } else {
      inventory.push({product: product, quantity: 1});
    }
    state.budget -= product.price;
  } else {
    alert(`You cannot afford to buy ${product.name}`);
  }

  display(state);
}


/**
 * Calculates the total price given the percentage profit and starting price.
 */
var calculateTotalPrice = function(percentageProfit, startingPrice) {
  var profit = (percentageProfit / 100) * startingPrice;
  var total = profit + startingPrice;
  return total;
}


/**
 * Sell the given product. This will alter the main
 * application state appropriately.
 *
 * Exercise: enable the customer to buy multiple items
 * at a time.
 */
var openSaleWindow = function(state, product) {
  var saleModalElement  = document.getElementById('saleModal');
  var saleNameElement   = document.getElementById('saleName');
  var salePriceElement  = document.getElementById('salePrice');
  var saleMarkupElement = document.getElementById('saleMarkup');
  var saleTotalElement  = document.getElementById('saleTotal');

  var totalPrice =
    calculateTotalPrice(state.saleMarkupPercentage, product.price);

  // Populate the sale window with details
  saleNameElement.innerText   = product.name;
  saleMarkupElement.innerText = `${state.saleMarkupPercentage}%`;
  salePriceElement.innerText  = `$${product.price}`;
  saleTotal.innerText         = `$${totalPrice}`;

  // Set the pending sale on the state
  state.pendingSale = {
    total: totalPrice,
    product: product
  }

  // Show the sale window
  saleModalElement.className += ' is-active';
  display(state);
}


/**
 * Creates a buy button for the given product.
 */
var createBuyButton = function(product) {
  var button = tag('a', {className: 'button is-primary is-small'});
  var icon = tag('span', {className: 'icon'});
  var i = tag('i', {className: 'fa fa-shopping-cart'});
  var text = tag('span');
  text.innerText = 'Buy';
  icon.appendChild(i);
  button.appendChild(icon);
  button.appendChild(text);

  button.addEventListener('click', function() {
    buyProduct(state, product);
  });

  return button;
};


/**
 * Creates a sell button for the given product.
 */
var createSellButton = function(product) {
  var button = tag('a', {className: 'button is-primary is-small'})
  var icon = tag('span', {className: 'icon'});
  var i = tag('i', {className: 'fa fa-shopping-cart'});
  var text = tag('span');
  text.innerText = 'Sell';
  icon.appendChild(i);
  button.appendChild(icon);
  button.appendChild(text);

  button.addEventListener('click', function() {
    openSaleWindow(state, product);
  });

  return button;
}


/**
 * Creates a table row for the given product.
 *
 * Exercise: color the row based on the relative product price to create
 * a heat-map effect.
 */
var createProductRow = function(product) {
  var row = tag('tr');
  var nameCell = tag('td');
  var priceCell = tag('td');
  var buttonCell = tag('td', {className: 'is-icon'});

  nameCell.innerText = product.name;
  priceCell.innerText = `$${product.price}`;
  buttonCell.appendChild(createBuyButton(product));

  row.appendChild(nameCell);
  row.appendChild(priceCell);
  row.appendChild(buttonCell);

  return row;
};


/**
 * Creates a table row for the given inventory item.
 *
 * Exercise: color the row based on the relative inventory count to create
 * a heat-map effect.
 */
var createInventoryRow = function(inventoryItem) {
    var row = tag('tr');
    var nameCell = tag('td');
    var quantityCell = tag('td');
    var buttonCell = tag('td', {className: 'is-icon'});

    nameCell.innerText = inventoryItem.product.name;
    quantityCell.innerText = inventoryItem.quantity;
    buttonCell.appendChild(createSellButton(inventoryItem.product));

    row.appendChild(nameCell);
    row.appendChild(quantityCell);
    row.appendChild(buttonCell);

    return row;
}


var createSaleRow = function(sale) {
  var row = tag('tr');
  var nameCell = tag('td');
  var saleCell = tag('td');
  var profitCell = tag('td');
  var buttonCell = tag('td', {className: 'is-icon'});

  nameCell.innerText = sale.product.name;
  saleCell.innerText = `$${sale.total}`;
  profitCell.innerText = `$${sale.total - sale.product.price}`;

  row.appendChild(nameCell);
  row.appendChild(saleCell);
  row.appendChild(profitCell);

  return row;
}


/**
 * Displays the current budget.
 *
 * Exercise: color the budget based on a threshold to indicate when it's
 * too low.
 */
var displayBudget = function(state) {
  var budgetAmount = state.budget;
  var budgetElement = document.getElementById('budget');
  budgetElement.innerText = '$' + budgetAmount;
};


/**
 * Displays the current profit.
 */
var displayProfit = function(state) {
  var profitAmount = state.profit;
  var profitElement = document.getElementById('profit');
  profitElement.innerText = '$' + profitAmount;
};


/**
 * Displays the products available in the supplier catalog.
 */
var displayCatalog = function(state) {
  var products = state.productList;

  // Create an HTML table row for each product
  var productRows = products.map(createProductRow);

  // Remove existing rows
  var productsTable = document.getElementById("productsTable");
  while (productsTable.firstChild) {
    productsTable.removeChild(productsTable.firstChild);
  };

  // Add the new rows
  productRows.forEach(function(row) {
    productsTable.appendChild(row);
  });
};


/**
 * Return a new inventory with the given product either decremented
 * or removed entirely if there was only one left.
 */
var removeFromInventory = function(product) {
  var initial = [];
  var decrement = function(prev, curr) {
    if (curr.product.id === product.id) {
      if (curr.quantity > 1) {
        curr.quantity -= 1;
        prev = prev.concat(curr);
      }
    } else {
      prev = prev.concat(curr);
    }
    return prev;
  }
  return state.inventory.reduce(decrement, initial);
}


/**
 * Our simple inventory rules:
 * - EMPTY: no items
 * - LOW: less than three items (either of a single type or across multiple types)
 * - HIGH: more than 6 of any one item
 * - OK: neither of the above are true
 */
var calculateInventoryStatus = function(inventory) {
  if (inventory.length === 0) {
    return 'EMPTY';
  } else if (3 > inventory.reduce(((prev, curr) => prev + curr.quantity), 0)) {
    return 'TOO LOW';
  } else if (inventory.some(x => x.quantity > 6)) {
    return 'TOO HIGH';
  } else {
    return 'OK';
  }
}


/**
 * Displays the inventory we must sell.
 */
var displayInventory = function(state) {
  var inventory = state.inventory;

  // Create an HTML table row for each product
  var inventoryRows = inventory.map(createInventoryRow);

  // Remove existing rows
  var inventoryTable = document.getElementById('inventoryTable');
  while (inventoryTable.firstChild) {
    inventoryTable.removeChild(inventoryTable.firstChild);
  }

  // Add the new rows
  inventoryRows.forEach(function(row) {
    inventoryTable.appendChild(row);
  });
}


/**
 * Displays the current inventory status.
 * Exercise: style the status to be "red if too low or high
 */
var displayInventoryStatus = function(state) {
  var inventoryStatus = calculateInventoryStatus(state.inventory);
  var inventoryStatusElement = document.getElementById('inventoryStatus');
  inventoryStatusElement.innerText = inventoryStatus;
}


var displaySales = function(state) {
  var sales = state.sales;
  var salesRows = sales.map(createSaleRow);

  // Remove existing rows
  var salesTable = document.getElementById('salesTable');
  while (salesTable.firstChild) {
    salesTable.removeChild(salesTable.firstChild);
  };

  // Add the new rows
  salesRows.forEach(function(row) {
    salesTable.appendChild(row);
  });
}


/**
 * Pretty print the state tree to the screen.
 */
var debugState = function(state) {
  var stateElement = document.getElementById('debugState');
  stateElement.innerText = JSON.stringify(state, null, '  ');
}


/**
 * Display the UI components based on the current state.
 */
var display = function(state) {
  displayBudget(state);
  displayInventoryStatus(state);
  displayProfit(state);
  displayCatalog(state);
  displayInventory(state);
  displaySales(state);
  debugState(state);
};

setupNewCatalogItemButton();
setupProcessNewCatalogItemButton();
setupCloseNewCatalogItemButton();
setupCancelSaleButtons(state);
setupProcessSaleButton(state);
display(state);
