# Web Communications Project

### Set up
- clone repo
-     git clone https://github.com/cmcrae1989/WebCommunicationsProject.git
- install front end packages
    - navigate to client folder and run
-     npm install react-router-dom bootstrap axios react-bootstrap react-icons
- install back end packages
    - navigate to server folder and run
-     npm install express mysql2 cors dotenv jsonwebtoken bcryptjs

#### * MySQL has to be downloaded locally! Homebrew for mac and mysql installer for windows *

### Run Project
- open terminal/bash and run the following commands
-     mysql.server start
-     mysql -u cmcrae -p
- enter password
-     P@ww0rd
- run command to select DB
-     USE ecommerce
- from here you can run mysql queries and type "EXIT" to stop
  
#### *DONT FORGET SEMICOLONS!!*

#### Running the backend

- starting in the root directory
-     cd server
- run command
-     npm start

#### Running the frontend

- starting in the root directory
-     cd client
- run command
-     npm start

## DATABASE SCHEMA


1. Users Table:
    * Stores user information such as username, email, and password.
    * If your application doesn't require users (i.e., guests can add items to the cart), you can skip this table.
2. Products Table:
    * Stores information about the products available for purchase, including name, description, price, stock quantity, and image URL.
    * The price is stored as a DECIMAL type with two decimal places for precision.
    * stock_quantity tracks how many units are available for each product.
3. Cart Items Table:
    * Represents products that a user has added to their cart. It has a many-to-one relationship with both the users and products tables.
    * quantity represents how many units of the product the user wants in their cart.
    * The unique constraint on (user_id, product_id) ensures that a user cannot add the same product multiple times to the cart. If they attempt to add the same product again, the quantity will just be updated.
4. Orders Table:
    * Once a user completes a checkout process, the order is created in this table.
    * It stores the total price of the order, the order status (pending, completed, cancelled, shipped), and the user_id to link the order to a user.
5. Order Items Table:
    * Contains details about the individual products in an order.
    * Each order can have multiple products (hence a many-to-many relationship between orders and products).
    * It also stores the price_at_purchase, which is useful for historical pricing in case the product price changes after the order.
### Example of How the Data Works:
- A user adds products to their cart, which is stored in the cart_items table.
- When they proceed to checkout, an order is created in the orders table.
- The individual products in that order are then saved in the order_items table, with the price_at_purchase field capturing the price of each product at the time of purchase.


admin  
vP3LRZLzvSVi0ugG6PSL  
ecommerce.cxo2ya20m42g.us-east-2.rds.amazonaws.com


