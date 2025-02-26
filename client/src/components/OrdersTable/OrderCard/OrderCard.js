import React from 'react'
import "./orderCard.css"

const testLogo = require("../../../assets/images/logo.png")

// Card item is every label with value below it
const CardItem = ({label, value}) => {

  return (
    <div className='order-card-item-container'> 
      <h6>{label}</h6>
      <p>{value ? value : "N/A"}</p>
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

  return (
    <div className='order-card-container'>
      
      <CardItem label={"Order ID"} value={"#18"} leftBorder={false} rightBorder={false}></CardItem>
      <button style={{"backgroundColor": colors[status]}}>
        <p>{status}</p>
        <img src={testLogo} alt='Edit'/>
      </button>
      <div className='seperator'></div>

      <CardItem label={"Total"} value={"$78.25"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Time"} value={"2025/02/01 - 1:28"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Name"} value={"Jimmy Test"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Phone"} value={null}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Country"} value={"US"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"City"} value={"Windsor"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"State"} value={"OH"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Postal Code"} value={"1234567"}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Line 1"} value={"123 Sesame Street "}></CardItem>
      <div className='seperator'></div>
      <CardItem label={"Line 2"} value={null}></CardItem>

    </div>
  )
}

export default OrderCard