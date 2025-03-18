import React, { useState } from 'react'
import "./orderCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'

const editIcon = require("../../../assets/icons/edit.png")
const arrowIcon = require("../../../assets/icons/arrow.png")

/**
 * Displays order details and order items which are apart of the order.
 * @param {object} order Order object which contains all information about the order.
 * @param {function} setOrder Function which handles setting the order to be updated in the order form.
 * @param {function} showOrderForm Function which handles displaying the order form for order.
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
    <li className='cards-container'>

      {/* Order card which shows order details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Order ID", id, 3.5, false],
          ["", UpdateOrderButton(), 7.5, true],
          ["Total", `$${total}`, 4, true],
          ["Time", new Date(createdAt).toLocaleString("en-US"), 10.25, true],
          ["Name", name, 8, true],
          ["Phone", phone, 6.5, true],
          ["Country", country, 4, true],
          ["City", city, 5.75, true],
          ["State", state, 3.25, true],
          ["Postal Code", postalCode, 5, true],
          ["Line 1", line1, 11.25, true],
          ["Line 2", line2, 6, false],
        ]}></LabelValueDisplay>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

      {/* Dropdown which displays order items for order */}
      <ul className={`card-items-container ${showDropdown ? "show" : ""}`}>
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
                  <div className='card-item-container'>
                    <LabelValueDisplay labelValues={[
                      ["Product Variant ID", id, 7, true],
                      ["Name", productName, 6, true],
                      ["Size", size, 5, true],
                      ["Color", color, 5, true],
                      ["Price At Purchase", priceAtPurchase, 7, true],
                      ["Quantity", quantity, 5, true],
                      ["Color", color, 5, true],
                      ["Gender", gender, 5, false],
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