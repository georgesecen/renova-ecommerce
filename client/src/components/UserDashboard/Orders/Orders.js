import React from 'react'
import "./orders.css"

const Orders = ({orders}) => {


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
      <div>
        <div className='order-items-header'>
          <h3>Order #: {id}</h3>
          <p>Order Details</p>
        </div>
        <p>{lastUpdated} | {status} | Total: ${total}</p>

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
                  <h2>{name}</h2>
                  <h4>{color}-{size}-{gender}</h4>
                  <h4>Qty: {quantity}</h4>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  } 

  console.log(orders)

  return (
    <div>
      {
        orders.map((order, index) => {
          return <OrderItems order={order} key={index} />
        })
      }
    </div>
  )
}

export default Orders