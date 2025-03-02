import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"
import { getOrders, updateOrderStatus } from '../../services/orders'
import ModalSpinner from '../ModalSpinner/ModalSpinner'

const OrdersTable = ({displayNotification}) => {

  const [orders, setOrders] = useState([])
  const [loadOrders, setLoadOrders] = useState(true) // When set to true will trigger reload of orders
  const [loading, setLoading] = useState(false)

  // Get orders
  useEffect(() => {
    if (loadOrders){
      getOrders()
        .then((response) => setOrders(response.data.data))
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
        .finally(() => setLoadOrders(false))
    }
  }, [loadOrders])

  
  // Function updates orders status
  function updateOrder(id, status){
    setLoading(true)
    updateOrderStatus(id, status)
      .then((response) => displayNotification("Update", response.data.message))
      .catch((error) => displayNotification("Update", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadOrders(true)})
  }


  return (
    <div className='order-table-container'>
      {loading && <ModalSpinner />}
      <ul>
          {
            orders.map((order, index) => {
              return <OrderCard key={index} order={order} update={updateOrder}/>
            })
          }
      </ul>
    </div>
  )
}

export default OrdersTable