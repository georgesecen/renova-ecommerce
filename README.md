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

<!-- My contributions section -->
## 💻 My Contributions
What I personally contributed to this project.


### Product Management
https://github.com/user-attachments/assets/9a8661b0-0bbc-4ab6-a963-1db6db29d0b8

- Create and delete products in database and via Stripe API so products are available at Stripe checkout.
- Modify product descriptions, prices, and stock quantities.
- Add images to products.
- Filter by product categories.

### Order Placement
https://github.com/user-attachments/assets/b90d5488-6cf3-419b-a94b-782c71fff9df

- Embedded Stripe checkout session so customers never have to leave the website.
- Allow customers to purchase products from their cart at a Stripe checkout session.
- Give customer order confirmation and receipt.


### Order Management
https://github.com/user-attachments/assets/bf4cfaf1-5988-4bb2-82bb-8f883166d122

- View all necessary order details so admin can fulfill orders and ship to customers the clothes they ordered.
- Update order status.
- Give option to fully refund order back to customers credit/debit card used at checkout.
- Filter by order status.

### Category Management
https://github.com/user-attachments/assets/7d3e1922-40b3-4bb2-b3ef-23bd7082824a

- Create and delete categories which products can fall under and customers can sort by in store.

### Data Visualization
<img alt=Data src=/images/bar-chart.png width=850px />
<img alt=Data src=/images/pie-chart.png width=850px />

- View revenue and sales history with a bar chart.
- View best selling products with a pie chart.
- Filter data for the last 7 days, 30 days, 90 days, or 365 days.


### Customer Dashboard
<img alt=Data src=/images/user-dashboard.png width=850px />

- Allow customer to view their order history and review details such as order status, items, times, total etc.