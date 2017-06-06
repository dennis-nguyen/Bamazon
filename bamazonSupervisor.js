const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});
const Table = require("easy-table");

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
    supervisorMenu();
});

let supervisorMenu = () => {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"],
        name: "choice"
    }]).then(function (answer) {
        console.log(answer.choice);
        if (answer.choice == "View Product Sales by Department") {
            showTable();
        }
        if (answer.choice == "Create New Department") {
            newDptPrompt();
        }
    });
};

let showTable = () => {
    let sql = "SELECT department_id, department_name, over_head_costs, total_sales, (total_sales - over_head_costs) AS total_profit FROM departments";
    connection.query(sql, function (error, results, fields) {
        let t = new Table;
        results.forEach(function (data) {
            t.cell('Department ID', data.department_id);
            t.cell('Department Name', data.department_name);
            t.cell('Over Head Costs', data.over_head_costs);
            t.cell('Product Sales', data.total_sales);
            t.cell('Total Profit', data.total_profit);
            t.newRow();
        });
        console.log(t.toString());
        supervisorMenu();
    });
};

let newDptPrompt = () => {
  inquirer.prompt([{
      type: "input",
      message: "What is the name of the new department?",
      name: "departmentName"
    },
    {
      type: "input",
      message: "What is the over head cost for the new department?",
      name: "overHead"
    }
  ]).then(function (answer) {
    addNewDpt(answer.departmentName, parseFloat(answer.overHead));
  });
};

let addNewDpt = (name, cost) => {
  let sql = `INSERT INTO departments (department_name, over_head_costs) 
  VALUES ('${name}', ${cost})`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  supervisorMenu();
};