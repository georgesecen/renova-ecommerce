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
REFRESH_SECRET=my_super_secret_key
STRIPE_SECRET_KEY=sk_test_51QkxnbK1RDrGHWB83Dj2mKotljJjJAwG0EnuJpz9qI0j11WCcFokRmf5z0p2PKKwgUWQvFDy5rFQxQ7HSVnKO5Zd00bCFsczkH
STRIPE_WEBHOOK_SECRET=whsec_4798b91eb4ce6d978dc9ffbe61d824f01a1d364bf3f53b7608556e652602c556
ADMIN_PASSWORD=1234
# EMAIL_USER=renova2025@outlook.com
# EMAIL_PASSWORD=kXgZ6pKczH9x
# EMAIL_SERVICE_ID=service_g7pqxqe
# EMAIL_PUBLIC_KEY=xcxrC1TPmd1ivmMQY
# EMAIL_WELCOME_TEMPLATE_ID=template_j92hw2d
# EMAIL_CONTACT_TEMPLATE_ID=template_kkb56pf
# Stripe api rate limit per second (100 in livemode, 25 in testmode)
STRIPE_RATE_LIMIT=25
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
# **E-Commerce Database Model: Changes & Updates**

---

## **🔹 Schema to be Updated Soon**
This section contains the **original database schema** before updates.

```sql
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL, -- Base price (can be adjusted per variant)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2), -- Optional: Allow custom pricing per variant
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_variant_id INT NULL, -- Images can be specific to a variant
    is_primary BOOL DEFAULT FALSE,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_variant_id INT NOT NULL, -- Refers to specific size/color
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled', 'shipped') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_variant_id INT NOT NULL, -- Tracks specific size/color
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL, -- Store price at purchase time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);
```
### Mostly Updated Schema
```sql
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE, -- ✅ NEW: Auto-generated for tracking before signup
    username VARCHAR(255) UNIQUE, 
    email VARCHAR(255) UNIQUE, 
    password VARCHAR(255), 
    guest BOOLEAN DEFAULT FALSE, -- ✅ NEW: Differentiates guests from registered users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE guest_users ( -- ✅ NEW TABLE: Supports guest checkout
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE, -- Used to track guest session
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_variant_id INT NULL,
    is_primary BOOL DEFAULT FALSE,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- ✅ UPDATED: Now nullable to support guest carts
    guest_user_id INT NULL, -- ✅ NEW: Enables guest carts
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_user_id) REFERENCES guest_users(id) ON DELETE CASCADE, -- ✅ NEW
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    CHECK (
        (user_id IS NOT NULL AND guest_user_id IS NULL) OR 
        (guest_user_id IS NOT NULL AND user_id IS NULL)
    ) -- ✅ NEW: Ensures only one type of user owns the cart
);

CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- ✅ UPDATED: Nullable for guest orders
    guest_user_id INT NULL, -- ✅ NEW: Enables guest checkout
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled', 'shipped') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_user_id) REFERENCES guest_users(id) ON DELETE CASCADE, -- ✅ NEW
    CHECK (
        (user_id IS NOT NULL AND guest_user_id IS NULL) OR 
        (guest_user_id IS NOT NULL AND user_id IS NULL)
    ) -- ✅ NEW: Ensures only one user type per order
);

CREATE TABLE order_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE shipping_addresses (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- ✅ UPDATED: Nullable for guest shipping addresses
    guest_user_id INT NULL, -- ✅ NEW: Allows guests to provide shipping info
    order_id INT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_user_id) REFERENCES guest_users(id) ON DELETE CASCADE, -- ✅ NEW
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    CHECK (
        (user_id IS NOT NULL AND guest_user_id IS NULL) OR 
        (guest_user_id IS NOT NULL AND user_id IS NULL)
    ) -- ✅ NEW: Ensures shipping address belongs to only one type of user
);
```
## New DB Model

![ecommerce model](https://github.com/user-attachments/assets/70860595-31e4-4a5e-88d0-8770a24f8ad2)

### From here we will be using migrations to make changes to the database

To reflect the database changes, navigate to the server directory and run:
-     npx sequelize-cli db:migrate
- If sequelize is not installed npm should prompt you to install with the command.
- After sequelize is installed it will need to be initialized with the following command:
-     npx sequelize-cli init
- This generates a few new files
- Changes will need to be made to the config/config.json file to look like this

<img width="617" alt="Screenshot 2025-02-08 at 8 02 06 PM" src="https://github.com/user-attachments/assets/b2de0e87-1237-421f-9afe-ab84e9ed0161" />

* Make sure to change the database key to your mock database name: ecommerce(first initial, last initial)
* When you have the correct credentials run the migrate command again:
*     npx sequelize-cli db:migrate



