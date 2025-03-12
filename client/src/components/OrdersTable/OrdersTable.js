import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"
import { getOrders } from '../../services/orders'
import ModalSpinner from '../ModalSpinner/ModalSpinner'
import OrderForm from './OrderForm/OrderForm'

const OrdersTable = ({displayNotification}) => {

  const [orders, setOrders] = useState([])
  const [loadOrders, setLoadOrders] = useState(true) // When set to true will trigger reload of orders
  const [loading, setLoading] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Get orders
  useEffect(() => {
    if (loadOrders){
      getOrders()
        .then((response) => setOrders(response.data.data))
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
        .finally(() => setLoadOrders(false))
    }
  }, [loadOrders])


  return (
    <div className='order-table-container'>
      {loading && <ModalSpinner />}
      {
        showOrderForm && 
        <OrderForm
          show={showOrderForm} 
          setShow={setShowOrderForm} 
          setLoading={setLoading}
          setLoadOrders={setLoadOrders}
          order={selectedOrder} 
          displayNotification={displayNotification}
          >
        </OrderForm>
      }
      <ul>
          {
            orders.map((order, index) => {
              return <OrderCard key={index} order={order} setOrder={setSelectedOrder} showOrderForm={setShowOrderForm}/>
            })
          }
      </ul>
    </div>
  )
}

export default OrdersTable