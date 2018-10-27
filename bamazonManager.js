var mysql = require("mysql");
var inquirer = require("inquirer");

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

function allProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nAll Products: ");
        for (var i = 0; i < res.length; i++) {
            console.log("\nItem ID: " + res[i].item_id +
                "\nProduct Name: " + res[i].product_name +
                "\nPrice: " + res[i].price +
                "\nQuantity: " + res[i].stock_quantity);
        }
        runApp();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var allStocked = true;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                allStocked = false;
                console.log("\nAll products with inventory lower than 5: ");
                console.log("\nItem ID: " + res[i].item_id +
                    "\nProduct Name: " + res[i].product_name +
                    "\nPrice: " + res[i].price +
                    "\nQuantity: " + res[i].stock_quantity + "\n");
            }
        }
        if (allStocked) {
            console.log("\nEvery product has a quantity greater than 5!\n");
        }
        runApp();
    });
}

function addInventoryPrompt() {
    connection.query("SELECT product_name FROM products", function (err, res) {
        if (err) throw err;
        var choices = [];
        for (var j = 0; j < res.length; j++) {
            choices.push(res[j].product_name);
        }
        inquirer.prompt([{
                type: "list",
                name: "itemSelect",
                message: "What product would you like to add inventory to?",
                choices: choices
            },
            {
                type: "input",
                name: "numberItems",
                message: "How many would you like to add?"
            }
        ]).then(function (ans) {
            var oldQuant = 0;
            connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", [ans.itemSelect], function(err, res) {
                if (err) throw err;
                oldQuant = res[0].stock_quantity;
                addInventory(ans.itemSelect, ans.numberItems, oldQuant);
            });
        });
    });
}

function addInventory(item, quantity, existing) {
    var newQuant = parseInt(quantity) + parseInt(existing);
    connection.query("UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: newQuant
            },
            {
                product_name: item
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("\nInventory for " + item + " updated!\n");
            runApp();
        });
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the product that you would like to add?"
        },
        {
            type: "input",
            name: "department",
            message: "What is the department it belongs in?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of the product?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "What is the initial stock amount?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(ans) {
        var sql = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ?";
        var values = [["NULL", ans.name, ans.department, ans.price, ans.quantity]];
        connection.query(sql, [values], function(err, res) {
            if (err) throw err;
            console.log(`
${ans.name} added!
            `);
            runApp();
        });
    });
}

function runApp() {
    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then(function (ans) {
        var command = ans.command;
        if (command === "View Products for Sale") {
            allProducts();
        } else if (command === "View Low Inventory") {
            lowInventory();
        } else if (command === "Add to Inventory") {
            addInventoryPrompt();
        } else if (command === "Add New Product") {
            addProduct();
        } else {
            connection.end();
            return;
        }
    });
}

runApp();