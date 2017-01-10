# Yay Bikes!

We're going to build a bike shop inventory management system.

## Budget

This is the amount of money you have available to buy more inventory.

## Supplier

This is the list of items that you can purchase and add to your inventory

### Actions

- View items
- Purchase item

### Data
- list of items each with a
  - name
  - category
  - purchase price

## Inventory

This is your inventory of items that you purchased from the supplier. You will sell these items to a customer (hopefully for a profit).

### Actions

- View inventory
- Sell inventory (how to implement this? Like a shopping cart?)

### Data
- name
- category
- quantity
- purchase price

## Sales

This is the record of sales you made.
- item
- quantity
- sale price
- date


- View a list of all items in stock
- View a total number of all items in stock
- View a total value of all items in stock
- View number of items that are low in stock

Next time...
- View total number of all sold items
- View total value of all sold items

- Add new inventory items
- Edit existing inventory items
- Delete existing inventory items
- Sell existing inventory items


```javascript

// Catalog
items = [
  {
    name: 'Jersey',
    category: 'Clothing',
    purchasePrice: 55
  },
  {
    name: 'Shorts',
    category: 'Clothing',
    purchasePrice: 75
  },
  {
    name: 'Gloves',
    category: 'Clothing',
    purchasePrice: 35
  },
  {
    name: 'Specialized Stumpjumper Fatty',
    category: 'Bikes',
    purchasePrice: 3500
  },
  {
    name: 'Trek Domane Disc',
    category: 'Bikes',
    purchasePrice: 6000
  },
  {
    name: 'Gary Fisher Sugar 3',
    category: 'Bikes',
    purchasePrice: 4500
  },
  {
    name: 'Cannondale Foot Pump',
    category: 'Tools',
    purchasePrice: 80
  },
  {
    name: 'WD40 Chain Lube',
    category: 'Tools',
    purchasePrice: 12
  },
  {
    name: 'Topeak Torque Wrench',
    category: 'Tools',
    purchasePrice: 120
  }
]

// Inventory
items = [
  {
    name: 'Jersey',
    category: 'Clothing',
    purchasePrice: 55,
    salePrice: 75
  }
]

// Sales
sales = [
    {
      name: 'Jersey',
      category: 'Clothing',
      purchasePrice: 55,
      salePrice: 75,
      date: "2016-10-04",
      customer: "Greg LeMond"
    }
]

// Reports

inventoryReport = [
  totalInventory: [
    {name: 'Clothing', profit: 3000},
    {name: 'Bikes', profit: 5000},
    {name: 'Tools', profit: 2000}
  ],
  lowInventory:
]

salesReport = [
  profit: 10234,
  categories: [
    {name: 'Clothing', profit: 3000},
    {name: 'Bikes', profit: 5000},
    {name: 'Tools', profit: 2000}
  ]
]

```
