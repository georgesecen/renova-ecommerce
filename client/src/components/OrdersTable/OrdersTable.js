import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"
import { getOrders } from '../../services/orders'

const OrdersTable = () => {

  const [orders, setOrders] = useState([])

  // Get orders
  useEffect(() => {
  getOrders()
    .then((response) => {setOrders(response.data.data)})
    .catch((error) => {console.log(error)})
  }, [])

  console.log(orders)


  return (
    <ul className='order-table-container'>

        {
          orders.map((order, index) => {
            return <OrderCard key={index} orderItem={order}/>
          })
        }
    </ul>
  )
}

export default OrdersTable