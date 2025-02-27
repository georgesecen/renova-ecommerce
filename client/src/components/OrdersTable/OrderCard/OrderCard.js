import React, { useState } from 'react'
import "./orderCard.css"

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


// Order item is every order item in the dropdown of the order
const OrderItem = ({productVariantId, name, priceAtPurchase, quantity, size, color, gender}) => {
  return (
    <div className='order-item-container'>
      <LabelValue label={"Product Variant Id"} value={productVariantId}></LabelValue>
      <div className='seperator'></div>
      <LabelValue label={"Name"} value={name}></LabelValue>
      <div className='seperator'></div>
      <LabelValue label={"Price At Purchase"} value={priceAtPurchase}></LabelValue>
      <div className='seperator'></div>
      <LabelValue label={"Quantity"} value={quantity}></LabelValue>
      <div className='seperator'></div>
      <LabelValue label={"Size"} value={size}></LabelValue>
      <div className='seperator'></div>
      <LabelValue label={"Color"} value={color}></LabelValue>
      <div className='seperator'></div>
      <LabelValue label={"Gender"} value={gender}></LabelValue>
    </div>
  )
}

const OrderCard = ({status}) => {

  // Display different button colors based on order status
  const colors = {
    completed: "#5FC21C",
    pending: "#E88D58",
    shipped: "#7157FF",
    canceled: "#FB3C3F"
  }

  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className='order-card-container'>
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='order-card-header-container'>
        
        <LabelValue label={"Order ID"} value={"#18"} leftBorder={false} rightBorder={false}></LabelValue>
        <button onClick={(event)=>{event.stopPropagation() /*To prevent sub menu showing*/ }} style={{"backgroundColor": colors[status]}}>
          <p>{status}</p>
          <img src={editIcon} alt='Edit'/>
        </button>
        <div className='seperator'></div>

        <LabelValue label={"Total"} value={"$78.25"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Time"} value={"2025/02/01 - 1:28"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Name"} value={"Jimmy Test"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Phone"} value={null}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Country"} value={"US"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"City"} value={"Windsor"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"State"} value={"OH"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Postal Code"} value={"1234567"}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Line 1"} value={"123 Sesame Street "}></LabelValue>
        <div className='seperator'></div>
        <LabelValue label={"Line 2"} value={null}></LabelValue>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

      <ul className={`order-card-items-container ${showDropdown ? "show" : ""}`}>
        <li>
        <OrderItem 
          productVariantId={"#18"} 
          name={"Cool Hoodie"} 
          priceAtPurchase={"$19.99"}
          quantity={2}
          size={"XL"}
          color={"Red"}
          gender={"Women"}
        ></OrderItem>
        </li>
        <li>
        <OrderItem 
          productVariantId={"#18"} 
          name={"Cool Hoodie"} 
          priceAtPurchase={"$19.99"}
          quantity={2}
          size={"XL"}
          color={"Red"}
          gender={"Women"}
        ></OrderItem>
        </li>
        <li>
        <OrderItem 
          productVariantId={"#18"} 
          name={"Cool Hoodie"} 
          priceAtPurchase={"$19.99"}
          quantity={2}
          size={"XL"}
          color={"Red"}
          gender={"Women"}
        ></OrderItem>
        </li>
        
      </ul>

    </div>
  )
}

export default OrderCard