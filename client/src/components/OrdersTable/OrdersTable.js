import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"
import { getOrders, updateOrderStatus } from '../../services/orders'
import ModalSpinner from '../ModalSpinner/ModalSpinner'

const OrdersTable = () => {

  const [orders, setOrders] = useState([])

  // Get orders
  useEffect(() => {
    getOrders()
      .then((response) => {setOrders(response.data.data)})
      .catch((error) => {console.log(error)})
  }, [])

  console.log(orders)

  function updateOrder(id, status){
    updateOrderStatus(id, status)
      .then((response) => {console.log(response.data)})
      .catch((error) => {console.log(error)})
  }


  return (
    <ul className='order-table-container'>

        {
          orders.map((order, index) => {
            return <OrderCard key={index} order={order} update={updateOrder}/>
          })
        }
    </ul>
  )
}

export default OrdersTable