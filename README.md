# bamazon

* This app is broken down into three js files
* The files allow users to act as a customer, a manager, or a supervisor

* For the customer app (bamazonCustomer.js) the user can view all products for sale and select a purchase. 
The user selects the ID number of the product they would like to purchase and then is promped to enter the quantity that they would like to buy.  After that the mySql database is updated and the application ends.

* For the manager app (bamazonManager.js) the user can do several things: 
    1. View products for sale
        * allows the user to see all available products along with details such as stock quantity and price
    2. View low inventory
        * shows all products with a stock quantity of less than 5
    3. Add to inventory
        * allows the user to increase inventory of a specific product
    4. Add new products
        * allows the user to add a product

* For the supervisor app (bamazonSupervisor.js) the user can do two things: 
    1. View product sales by department
        * view a table that shows departments and their profits
    2. Create a new department 
        * allows the user to make a new department 


![](bamazonvid.webm)
