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

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Keep track of what order status' are being filtered in (diplayed to admin)
  const [filteredOrders, setFilteredOrders] = useState({
    "completed": true,
    "pending": true,
    "shipped": true,
    "cancelled": true,
  })


  // Function will set an order status to true or false and re render the component to filter the orders
  function filterOrder(status, filter){
    filteredOrders[status] = filter
    setFilteredOrders({...filteredOrders})
  }


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
    <div className='table-container'>
      {loading && <ModalSpinner />}
      <OrderForm
        show={showOrderForm} 
        setShow={setShowOrderForm} 
        setLoading={setLoading}
        setLoadOrders={setLoadOrders}
        order={selectedOrder} 
        displayNotification={displayNotification}
        >
      </OrderForm>

      {/* Update filtered orders based on if checkmarks are checked or unchecked */}
      {/* Checkboxs which are checked will be displayed */}
      <input type="checkbox" defaultChecked={true} onChange={(event) => filterOrder("completed", event.target.checked)}/> Completed
      <input type="checkbox" defaultChecked={true} onChange={(event) => filterOrder("pending", event.target.checked)}/> Pending
      <input type="checkbox" defaultChecked={true} onChange={(event) => filterOrder("shipped", event.target.checked)}/> Shipped
      <input type="checkbox" defaultChecked={true} onChange={(event) => filterOrder("cancelled", event.target.checked)}/> Cancelled
      
      <ul>
          {
            orders.map((order, index) => {
              // Only render order if its checkbox is checked
              if (filteredOrders[order.status] === true){
                return <OrderCard key={index} order={order} setOrder={setSelectedOrder} showOrderForm={setShowOrderForm}/>
              }
            })
          }
      </ul>
    </div>
  )
}

export default OrdersTable