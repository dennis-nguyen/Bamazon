-- CREATE DATABASE if not exists Bamazon;
-- 
-- Use Bamazon;
-- 
-- CREATE TABLE products (
-- item_id INTEGER(90) AUTO_INCREMENT NOT NULL,
-- product_name VARCHAR(90) NOT NULL,
-- department_name VARCHAR(90) NOT NULL,
-- price INTEGER(90) NOT NULL,
-- stock_quantity INTEGER (10) NOT NULL,
-- PRIMARY KEY (item_id)	
-- );
-- 
-- INSERT INTO products(product_name, department_name, price, stock_quantity)
-- VALUES ("Iphone 7", "Electronics", 700, 400),
-- 	   ("Fiio e10k", "Electronics", 75, 500),
--        ("Acer XB270HU", "Electronics", 500, 200),
--        ("Vitafusion MultiVites", "Health", 8, 800),
--        ("Hydroflask", "Outdoors", 30, 650),
--        ("Hamburger", "Food", 4, 360),
--        ("Radwimps CD", "Music", 20, 220),
--        ("Clorox Clean Wipes", "Home", 5, 1500),
--        ("Oreos", "Food", 3, 700),
--        ("Sake Kit Kats", "Food", 10, 150);
--        
-- SELECT * FROM products;
-- 

-- delete from products
-- where item_id = 5;

-- INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
-- VALUES (5, "Hydroflask", "Outdoors", 30, 650);
-- 

-- 
-- ALTER TABLE products
-- ADD product_sales INTEGER(200) NOT NULL DEFAULT 0;
-- 


-- CREATE TABLE departments (
-- department_id INTEGER(90) AUTO_INCREMENT NOT NULL,
-- department_name VARCHAR(90) NOT NULL,
-- over_head_costs INTEGER (90) NOT NULL DEFAULT 2500,
-- total_sales INTEGER (90) NOT NULL DEFAULT 0,
-- PRIMARY KEY (department_id)	
-- );
-- 

-- use bamazon;

-- SELECT departments.department_name, products.department_name, departments.total_sales, products.product_sales
-- FROM departments
-- INNER JOIN products ON departments.department_name=products.department_name;
-- 
-- INSERT INTO departments(department_name, over_head_costs, total_sales)
-- VALUES ("Electronics", 12500, 0),
--        ("Health", 1000, 0),
--        ("Outdoors", 3000, 0),
--        ("Food", 500, 0),
--        ("Music", 300, 0),
--        ("Home", 500, 0),
--        ("Kitchen", 700, 0);
--        

use bamazon;

-- SELECT department_id, department_name, over_head_costs, total_sales, (total_sales * 2) AS total_profit FROM departments;
-- 
-- SELECT * from products;

UPDATE departments SET total_sales = 0;

select * from products;

SELECT * from departments;