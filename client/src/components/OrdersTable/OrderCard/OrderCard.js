import React, { useState } from 'react'
import "./orderCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'

const editIcon = require("../../../assets/icons/edit.png")
const arrowIcon = require("../../../assets/icons/arrow.png")

/**
 * Displays order details and order items which are apart of the order.
 * @param {object} order Order object which contains all information about the order.
 * @param {function} update Function which updates the order status.
 * @returns {React.JSX.Element} OrderCard React component.
 */
const OrderCard = ({order, setOrder, showOrderForm}) => {

  const [showDropdown, setShowDropdown] = useState(false)

  // Pending, completed, shipped button
  const UpdateOrderButton = () => {
    return (
      <button 
        onClick={(event)=>{

          // Display the order form for order
          event.stopPropagation() // To prevent sub menu showing
          setOrder(order)
          showOrderForm(true)
        }} 
        className='update-order-button'
        style={{"backgroundColor": colors[status]}}
      >
        <p>{status}</p>
        <img src={editIcon} alt='Edit'/>
      </button>
    )
  }
  

  // Get order details
  const {
    id,
    status, 
    total_price: total,
    order_items: orderItems,
    createdAt
  } = order ?? {}

  // Get shipping details
  const {
    address_line1: line1,
    address_line2: line2,
    country,
    state, 
    city,
    postal_code: postalCode,
    recipient_name: name,
    phone_number: phone
  } = order.shipping_address ?? {}


  // Display different button colors based on order status
  const colors = {
    completed: "#5FC21C",
    pending: "#E88D58",
    shipped: "#7157FF",
    cancelled: "#FB3C3F"
  }

  return (
    <li className='order-card-container'>

      {/* Order card which shows order details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='order-card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Order ID", `#${id}`, false],
          ["", UpdateOrderButton(), true],
          ["Total", `$${total}`, true],
          ["Time", new Date(createdAt).toLocaleString("en-US"), true],
          ["Name", name, true],
          ["Phone", phone, true],
          ["Country", country, true],
          ["City", city, true],
          ["State", state, true],
          ["Postal Code", postalCode, true],
          ["Line 1", line1, true],
          ["Line 2", line2, false],
        ]}></LabelValueDisplay>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

      {/* Dropdown which displays order items for order */}
      <ul className={`order-card-items-container ${showDropdown ? "show" : ""}`}>
          {
            orderItems.map((orderItem, index) => {
              // Get order item details
              const {
                price_at_purchase: priceAtPurchase,
                quantity,
              } = orderItem

              // Get order items product variant details
              const {
                id,
                size,
                color,
                gender,
              } = orderItem.product_variant
              const {name: productName} = orderItem.product_variant.product

              // Order item
              return (
                <li key={index}>
                  <div className='order-item-container'>
                    <LabelValueDisplay labelValues={[
                      ["Product Variant ID", id, true],
                      ["Name", productName, true],
                      ["Size", size, true],
                      ["Color", color, true],
                      ["Price At Purchase", priceAtPurchase, true],
                      ["Quantity", quantity, true],
                      ["Color", color, true],
                      ["Gender", gender, false],
                    ]}></LabelValueDisplay>
                  </div>
                </li>
              )
            })
          }
      </ul>

    </li>
  )
}

export default OrderCard