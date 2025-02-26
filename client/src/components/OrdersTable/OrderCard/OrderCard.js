import React from 'react'
import "./orderCard.css"

const testLogo = require("../../../assets/images/logo.png")

// Card item is every label with value below it
const CardItem = ({label, value}) => {
  return (
    <div className='order-card-item-container'> 
      <h6>{label}</h6>
      <p>{value}</p>
    </div>
  )
}

const OrderCard = () => {
  return (
    <div className='order-card-container'>
      OrderCard
      
      <button>
        <p>Shipped</p>
        <img src={testLogo} alt='Edit'/>
      </button>

      <CardItem label={"Order ID"} value={"#18"}></CardItem>
    </div>
  )
}

export default OrderCard