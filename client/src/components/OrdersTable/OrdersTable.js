import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"
import { getOrders } from '../../services/orders'

const OrdersTable = () => {

  const [orders, setOrders] = useState()

  // Get orders
  useEffect(() => {
  getOrders()
    .then((response) => {setOrders(response.data)})
    .catch((error) => {console.log(error)})
  }, [])

  console.log(orders)


  return (
    <div className='order-table-container'>
        <OrderCard status={"completed"}></OrderCard>
    </div>
  )
}

export default OrdersTable