# Web Communications Project

### Set up
- clone repo
-     git clone https://github.com/cmcrae1989/WebCommunicationsProject.git
- install front end packages
    - navigate to client folder and run
-     npm install react-router-dom bootstrap axios react-bootstrap react-icons @stripe/react-stripe-js @stripe/stripe-js
- install back end packages
    - navigate to server folder and run
-     npm install express mysql2 nodemailer cors dotenv jsonwebtoken bcryptjs stripe googleapis

### Set up DB
- Install MySQL workbench https://dev.mysql.com/downloads/workbench/
- Create login
- Create new connection (+)
    - Connection name
    -     AWS MySQL
    - Host name
    -     ecommerce.cxo2ya20m42g.us-east-2.rds.amazonaws.com
    - Username
    -     admin
    - Password
    -     vP3LRZLzvSVi0ugG6PSL
<img width="797" alt="Screenshot 2025-01-26 at 9 36 56 AM" src="https://github.com/user-attachments/assets/b8db3ae1-61a0-4dd2-8622-518b1f6c28b8" />

### Everyone must create their own .env file in the root of the server directory
<img width="715" alt="Screenshot 2025-01-27 at 4 24 50 PM" src="https://github.com/user-attachments/assets/e6d2e488-029e-49b7-bd30-f49b90d4b63e" />

#### * Paste these credentials *

```
DB_HOST=ecommerce.cxo2ya20m42g.us-east-2.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=vP3LRZLzvSVi0ugG6PSL
DB_NAME=ecommerce{first and last initial here - all caps}
PORT=3306
CLIENT_ID=595612368789-11lkfbgcgn8decreuaijcp8dknjuampn.apps.googleusercontent.com
CLIENT_SECRET=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
JWT_SECRET=my_super_secret_key
STRIPE_SECRET_KEY=sk_test_51QkxnbK1RDrGHWB83Dj2mKotljJjJAwG0EnuJpz9qI0j11WCcFokRmf5z0p2PKKwgUWQvFDy5rFQxQ7HSVnKO5Zd00bCFsczkH
STRIPE_WEBHOOK_SECRET=whsec_4798b91eb4ce6d978dc9ffbe61d824f01a1d364bf3f53b7608556e652602c556
```




#### * MySQL no longer has to be downloaded locally! *

### Run Project

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
2. Products Table:
    * Stores information about the products available for purchase, including name, description, price, stock quantity, and image URL.
    * The price is stored as a DECIMAL type with two decimal places for precision.
    * stock_quantity tracks how many units are available for each product.
3. Cart Items Table:
    * Represents products that a user has added to their cart. It has a many-to-one relationship with both the users and products tables.
    * quantity represents how many units of the product the user has in their cart.
    * The unique constraint on (user_id, product_id) ensures that a user cannot add the same product multiple times to the cart. If they attempt to add the same product again, the quantity will just be updated.
4. Orders Table:
    * Once a user completes a checkout process, the order is created in this table.
    * It stores the total price of the order, the order status (pending, completed, cancelled, shipped), and the user_id to link the order to a user.
5. Order Items Table:
    * Contains details about the individual products in an order.
    * Each order can have multiple products (hence a many-to-many relationship between orders and products).
    * It also stores the price_at_purchase, which is useful for historical pricing in case the product price changes after the order.
### Example of How the Data Works:
- A user signs up with unique credentials which are saved in the users table after the password is hashed. a JWT is generated upon login to be kept in local storage for validation that persists throughout the site.
- A user adds products to their cart, which is stored in the cart_items table.
- When they proceed to checkout, an order is created in the orders table.
- The individual products in that order are then saved in the order_items table, with the price_at_purchase field capturing the price of each product at the time of purchase.

### Order in which tables are created
-- Create `users` table
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create `products` table
CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create `cart_items` table
CREATE TABLE cart_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create `orders` table
CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled', 'shipped') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create `order_items` table
CREATE TABLE order_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create `contacts` table
CREATE TABLE contacts (
    email_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message VARCHAR(255)
);

### Order in which tables are to be deleted
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

#### * Final Schema to be updated soon *
