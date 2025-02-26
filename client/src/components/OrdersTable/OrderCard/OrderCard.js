import React from 'react'
import "./orderCard.css"

const testLogo = require("../../../assets/images/logo.png")

// Card item is every label with value below it
const CardItem = ({label, value, leftBorder, rightBorder}) => {
  
  // To divide each piece of information
  const styles = {
    "border-left": leftBorder ? "1px solid #CDCDCD" : "",
    "border-right": rightBorder ? "1px solid #CDCDCD" : ""
  }

  return (
    <div className='order-card-item-container' style={styles}> 
      <h6>{label}</h6>
      <p>{value}</p>
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

      <CardItem label={"Total"} value={"$78.25"} leftBorder={true} rightBorder={true}></CardItem>
      <CardItem label={"Time"} value={"2025/02/01 - 1:28"} leftBorder={false} rightBorder={true}></CardItem>
      <CardItem label={"Name"} value={"Jimmy Test"} leftBorder={false} rightBorder={true}></CardItem>
      <CardItem label={"Country"} value={"US"} leftBorder={false} rightBorder={true}></CardItem>
      <CardItem label={"City"} value={"Windsor"} leftBorder={false} rightBorder={true}></CardItem>
      <CardItem label={"State"} value={"OH"} leftBorder={false} rightBorder={true}></CardItem>
      <CardItem label={"Postal Code"} value={"1234567"} leftBorder={false} rightBorder={true}></CardItem>
      <CardItem label={"Line 1"} value={"123 Sesame Street "} leftBorder={false} rightBorder={false}></CardItem>

    </div>
  )
}

export default OrderCard