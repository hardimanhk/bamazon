var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});

function runApp() {
    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }]).then(function (ans) {
        if (ans.command === "View Product Sales by Department") {
            viewDepartments();
        } else if (ans.command === "Create New Department") {
            newDepartment();
        } else {
            connection.end();
            return;
        }
    });
}

function viewDepartments() {
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) as sales ";
    query += "FROM products INNER JOIN departments ON (products.department_name = departments.department_name) GROUP BY products.department_name";
    query += " ORDER BY departments.department_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit'],
            colWidhths: [100, 200]
        });
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            if (res[i].sales) {
                table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].sales, (res[i].sales - res[i].over_head_costs)]);
            } else {
                table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, "null", "null"]);
            }
        }
        console.log(table.toString());
        runApp();
    });
}

function newDepartment() {
    inquirer.prompt([{
            type: "input",
            name: "name",
            message: "What is the name of the department that you would like to add?"
        },
        {
            type: "input",
            name: "overhead",
            message: "What is the overhead cost of this department?"
        }
    ]).then(function (ans) {
        var sql = "INSERT INTO departments (department_id, department_name, over_head_costs) VALUES ?";
        var values = [
            ["NULL", ans.name, ans.overhead]
        ];
        connection.query(sql, [values], function (err, res) {
            if (err) throw err;
            console.log(`
${ans.name} added!
            `);
            runApp();
        });
    });
}

runApp();