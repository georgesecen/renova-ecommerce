import React, { useState, useEffect } from 'react'
import { getUserOrders } from '../../../services/orders'
import "./orders.css"

const Orders = ({userId}) => {

  const [orders, setOrders] = useState([])
  console.log(orders)
  
  // Get user orders
  useEffect(() => {
      getUserOrders(userId)
        .then((response) => setOrders(response.data.data))
        .catch((error) => console.log(error))
    
  }, [])

  return (
    <div>Orders</div>
  )
}

export default Orders