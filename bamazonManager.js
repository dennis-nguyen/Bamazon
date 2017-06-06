const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require("easy-table");
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
  managerMenu();
});

let managerMenu = () => {
  inquirer.prompt([{
    type: "list",
    message: "What would you like to do?",
    choices: ["View products for sale", "Add new item", "Add quantity to an existing item", "View low inventory"],
    name: "choice"
  }]).then(function (answer) {
    console.log(answer.choice);
    if (answer.choice == "View products for sale") {
      showProducts("complete");
    }
    if (answer.choice == "Add new item") {
      addNewItem();
    }
    if (answer.choice == "Add quantity to an existing item") {
      showProducts("toAdd");
    }
    if (answer.choice == "View low inventory") {
      showLowStock();
    }
  });
};

let showProducts = (option) => {
  connection.query('SELECT * FROM `products`', function (error, results, fields) {
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
    if (option === "toAdd") {
      addQuantity();
    }
    if (option === "complete") {
      managerMenu();
    }
  });
};

let showLowStock = () => {
  connection.query('SELECT * FROM `products`', function (error, results, fields) {
    let t = new Table;
    results.forEach(function (product) {
      if (product.stock_quantity < 300) {
        t.cell('Product ID', product.item_id);
        t.cell('Product Name', product.product_name);
        t.cell('Department Name', product.department_name);
        t.cell('Price, USD', product.price, Table.number(2));
        t.cell('Stock Quantity', product.stock_quantity, Table.number());
        t.newRow();
      }
    });
    console.log(t.toString());
    managerMenu();
  });
};


let addNewItem = () => {
  inquirer.prompt([{
      type: "input",
      message: "What is the name of the product?",
      name: "productName"
    },
    {
      type: "input",
      message: "What department does this product fit into",
      name: "productDepartment"
    },
    {
      type: "input",
      message: "What is the price of the item?",
      name: "productPrice"
    },
    {
      type: "input",
      message: "How many of the item are available for sale?",
      name: "productStock"
    }
  ]).then(function (answer) {
    addDB(answer.productName, answer.productDepartment, parseFloat(answer.productPrice), parseFloat(answer.productStock));
  });
};

let addDB = (productName, productDepartment, productPrice, productStock) => {
  console.log(productName);
  let sql = `INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('${productName}', '${productDepartment}', ${productPrice}, ${productStock})`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  managerMenu();
};

let addQuantity = () => {
  inquirer.prompt([{
      type: "input",
      message: "What is the ID of the item you want to add more stock to?",
      name: "itemID"
    },
    {
      type: "input",
      message: "How many of the item do you want to add to the current stock?",
      name: "addStock"
    }
  ]).then(function (answer) {
   updateStock(answer.itemID, answer.addStock);
  });
};

let updateStock = (itemID, newStock) => {
  let sql = `UPDATE products SET stock_quantity = stock_quantity + ${newStock} WHERE item_ID = ${itemID}`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  showProducts("complete");
};