import React, { useState } from 'react'
import "./orderCard.css"
import OrderForm from '../OrderForm/OrderForm'
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'

const editIcon = require("../../../assets/icons/edit.png")
const arrowIcon = require("../../../assets/icons/arrow.png")

// Card item is every label with value below it
const LabelValue = ({label, value}) => {

  return (
    <div className='order-card-label-value-container'> 
      <h6>{label}</h6>
      <p>{value ? value : "N/A"}</p>
    </div>
  )
}

const OrderCard = ({order, update}) => {

  const [showDropdown, setShowDropdown] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

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

      <OrderForm show={showOrderForm} setShow={setShowOrderForm} update={update} orderStatus={status} orderId={id}/>

      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='order-card-header-container'>
        
        <LabelValue label={"Order ID"} value={`#${id}`}></LabelValue>
        <button 
          onClick={(event)=>{
            event.stopPropagation() // To prevent sub menu showing
            setShowOrderForm(!showOrderForm)
          }} 
          style={{"backgroundColor": colors[status]}}
        >
          <p>{status}</p>
          <img src={editIcon} alt='Edit'/>
        </button>
        <div className='seperator'></div>

        <LabelValue label={"Total"} value={`$${total}`}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Time"} value={new Date(createdAt).toLocaleString("en-US")}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Name"} value={name}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Phone"} value={phone}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Country"} value={country}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"City"} value={city}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"State"} value={state}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Postal Code"} value={postalCode}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Line 1"} value={line1}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Line 2"} value={line2}></LabelValue>

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
                      ["Product Variant ID", id],
                      ["Name", productName],
                      ["Size", size],
                      ["Color", color],
                      ["Price At Purchase", priceAtPurchase],
                      ["Quantity", quantity],
                      ["Color", color],
                      ["Gender", gender],
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