DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(7, 2) NULL,
    stock_quantity INT NULL
);

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT NULL
);


ALTER TABLE products
ADD COLUMN product_sales INT AFTER stock_quantity;