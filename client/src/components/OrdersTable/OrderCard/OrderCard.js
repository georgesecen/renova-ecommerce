import React from 'react'
import "./orderCard.css"

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
      <CardItem label={"Order ID"} value={"#18"}></CardItem>
    </div>
  )
}

export default OrderCard