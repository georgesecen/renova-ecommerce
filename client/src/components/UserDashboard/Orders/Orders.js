import React from 'react'
import "./orders.css"

/**
 * Displays the order history of the currently logged in customer in the user dashboard. Displays order
 * status, time, and order items apart of each order.
 * @param {Array<object>} orders All of the customers orders to be displayed.
 * @returns {React.JSX.Element} Orders user dashboard section React component.
 */
const Orders = ({ orders }) => {

  // Displays details about each customer order
  const OrderItems = ({order}) => {

    // Get all order details
    const {
      id,
      total_price: total,
      status,
      updated_at: lastUpdated,
      order_items: orderItems
    } = order

    return (
      <div className='order-items-container'>
        <div className='order-items-header'>
          <h5>Order #: {id}</h5>
          {/* <p>Order Details</p> */}
        </div>
        <p>{new Date(lastUpdated).toLocaleString("en-US")} | {status} | Total: ${total}</p>

        {/* Actual products which were apart of order */}
        <ul>
          {
            orderItems.map((orderItem, index) => {

              // Get order item details
              const { quantity } = orderItem
              const { color, size, product } = orderItem.product_variant
              const { name, gender } = product

              return (
                <li key={index}>
                  <p>{name}</p>
                  <p>{color} {size} {gender}</p>
                  <p>Qty: {quantity}</p>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  } 

  
  // If customer has no orders
  if (orders.length === 0){
    return <p>You have no orders.</p>
  }

  // Display all details of customers orders
  return (
    <div className='all-user-orders'>
      {
        orders.map((order, index) => {
          return <OrderItems order={order} key={index} />
        })
      }
    </div>
  )
}

export default Orders