const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'bamazon'
});
const Table = require("easy-table");
let itemIDs = []; //ITEM ID ARRAY
let itemPrices = []; //ITEM PRICE ARRAY
let itemStock = []; //ITEM STOCK ARRAY
let itemDepartment = []; //ITEM DEPARTMENT ARRAY
let itemIndex; //ITEM INDEX IN THE ARRAYS
let chosenItem; //ITEM ID

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
  showTable();
});

let showTable = () => {
  connection.query('SELECT * FROM `products`', function (error, results, fields) {
    updateItems(results);
    let t = new Table;

    results.forEach(function (product) {
      t.cell('Product ID', product.item_id);
      t.cell('Product Name', product.product_name);
      t.cell('Department Name', product.department_name);
      t.cell('Price, USD', product.price, Table.number(2));
      t.cell('Stock Quantity', product.stock_quantity, Table.number());
      t.newRow();
    });
    console.log(t.toString());
    promptItemID();
  });
};

let promptItemID = () => {
  inquirer.prompt([{
    type: "input",
    message: "What is the ID of the product you would like to purchase?",
    name: "productID"
  }]).then(function (answer) {
    if (itemIDs.indexOf(parseFloat(answer.productID)) > -1) {
      chosenItem = answer.productID;
      itemIndex = itemIDs.indexOf(parseFloat(chosenItem));
      promptQuantity();
    } else {
      console.log("Incorrect ID");
      promptItemID();
    }
  });
};

let promptQuantity = () => {
  inquirer.prompt([{
    type: "input",
    message: "How many would you like to buy?",
    name: "productQuantity"
  }]).then(function (answer) {
    if (answer.productQuantity <= itemStock[itemIndex]) {
      let currentSale = answer.productQuantity * itemPrices[itemIndex]; //WHAT WAS JUST BOUGHT
      let purchasedStock = answer.productQuantity; //AMOUNT OF ITEMS THAT WAS JUST BOUGHT
      updateDepartmentSales(currentSale);
      updateDB(currentSale, purchasedStock);
    } else {
      console.log("Incorrect Quantity");
      promptQuantity();
    }
  });
};

let updateDepartmentSales = (currentSale) => {
  let sql = `UPDATE departments SET total_sales = total_sales + ${currentSale} WHERE department_name = '${itemDepartment[itemIndex]}'`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
};

let updateDB = (currentSale, newStock) => {
  let sql = `UPDATE products SET stock_quantity = stock_quantity - ${newStock}, product_sales = product_sales + ${currentSale} WHERE item_ID = ${chosenItem}`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  resetValues();
  showTable();
};

let updateItems = (tableData) => {
  tableData.forEach((data) => {
    itemIDs.push(data.item_id);
    itemPrices.push(data.price);
    itemStock.push(data.stock_quantity);
    itemDepartment.push(data.department_name);
  });
};

let resetValues = () => {
  itemIDs = [];
  itemPrices = [];
  itemStock = [];
  itemDepartment = [];
};
