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

function showAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nAll Products: ");
        for (var i = 0; i < res.length; i++) {
            console.log("\nItem ID: " + res[i].item_id +
                "\nProduct Name: " + res[i].product_name +
                "\nPrice: " + res[i].price);
        }
        buyItem();
    });
}

showAll();

function buyItem() {
    inquirer.prompt([{
            type: "input",
            name: "itemID",
            message: "Please enter the ID number of the item you would like to purchase: ",
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
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (ans) {
        var requestID = ans.itemID;
        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [requestID], function (err, res) {
            if (err) throw err;
            if (ans.quantity <= res[0].stock_quantity) {
                var newQuant = res[0].stock_quantity - ans.quantity;
                updateItem(requestID, newQuant, ans.quantity);
            } else {
                console.log("\nInsufficient quantity in stock!\n");
                connection.end();
            }
        });
    });
}

function updateItem(item, newQuantity, bought) {
    connection.query("UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: newQuantity
            },
            {
                item_id: item
            }
        ],
        function (err, res) {
            if (err) throw err;
            showTotal(item, bought);
        });
}

function showTotal(id, multiplier) {
    connection.query("SELECT price, product_sales FROM products WHERE item_id = ?", [id], function (err, res) {
        if (err) throw err;
        var total = res[0].price * multiplier;
        console.log("\nYour total is: " + total.toFixed(2) + " dollars\n");
        updateProductSales(id, res[0].price, multiplier, res[0].product_sales);
        connection.end();
    });
}

function updateProductSales(item, price, amount, existingSales) {
    var sales = 0;
    if (existingSales) {
        sales = (price * amount) + existingSales;
    } else {
        sales = price * amount;
    }
    connection.query("UPDATE products SET ? WHERE ?",
        [{
                product_sales: sales
            },
            {
                item_id: item
            }
        ],
        function (err, res) {
            if (err) throw err;
        });
}