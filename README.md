<!-- About app Section -->
# 🛍️ Renova Ecommerce Website

A full stack ecommerce website powered by React.js, Express.js, and MySQL that directly accepts payments via Stripe API, with a dedicated admin/store dashboard for management of products and order fulfillment.

<div align=center>
    <img alt=Data src=/images/home.png width=700px />
</div>


<!-- Technologies used section -->
## 🔨 Built With

- Stripe API
- React.js
- Express.js
- MySQL
- Javascript
- HTML
- CSS


<!-- Features section -->
## ✨ Features

**Customer Features:**

- **User Authentication:**
    - Account creation and login for a personalized experience.
    - Successful sign-up sends a confirmation email to the customer.
- **Product Browsing:**
    - Browse and search for products.
    - View product details, including descriptions, images, and pricing.
- **Shopping Cart:**
    - Add products to a shopping cart.
    - View and modify cart contents.
- **Order Placement:**
    - Securely place orders.
- **Payment Processing:**
    - Directly accepts payments via Stripe API.
- **Order History:**
    - View past order history.

**Admin Features:**

- **Admin Dashboard:**
    - Dedicated dashboard for store management.
- **Product Management:**
    - Create new products.
    - Remove existing products.
    - Manage product inventory and details such as product descriptions, images, prices, and stock quantities.
- **Order Management:**
    - View and manage customer orders.
    - Fulfill orders and update order status.
- **Data Visualization:**
    - View order history, sales data, and best-selling products.


<!-- Getting started section -->
## 🚀 Getting Started

### Prerequisites
- Node.js
- MySQL database
- Stripe developer account

### Run Locally
1. Clone the repo:
   ```sh
   git clone https://github.com/georgesecen/renova-ecommerce.git
   ```
2. Navigate to the server directory and install required packages:
    ```
   npm install
   ```
3. Navigate to the client directory and install required packages:
    ```
    npm install
    ```
4. Create a .env in the server directory and add the following variables:
    ```
    DB_HOST= Your database host
    DB_USER= Your database username
    DB_PASSWORD= Your database password
    DB_NAME= Your database name
    PORT=
    SERVER_PORT= Your server port
    CLIENT_ID=
    CLIENT_SECRET=
    JWT_SECRET=
    REFRESH_SECRET=
    STRIPE_SECRET_KEY= Your Stripe API secret key
    STRIPE_WEBHOOK_SECRET= Your Stripe API webhook secret key
    EMAIL_USER= Your email user
    EMAIL_PASSWORD= Your email password
    EMAIL_HOST= Your email host
    ADMIN_PASSWORD= Secret key used to enter admin dashboard

    # Stripe api rate limit per second (100 in livemode, 25 in testmode)
    STRIPE_RATE_LIMIT=25
    ```
5. Create a .env in the client directory and add the following variables:
    ```
    REACT_APP_BASE_URL= Your server url
    REACT_APP_STRIPE_PUBLIC_KEY= Your Stripe API publishable key
    ```
6. Start your MySQL database.
7. Navigate to the server directory and start the server:
    ```
   npm start
   ```
8. Navigate to the client directory and start the client:
    ```
   npm start
   ```