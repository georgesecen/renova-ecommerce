import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"
import { adminOrdersService } from '../../services/orders'
import ModalSpinner from '../ModalSpinner/ModalSpinner'
import OrderForm from './OrderForm/OrderForm'
import Checkbox from '../Checkbox/Checkbox'

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
  function filterOrders(status, filter){
    filteredOrders[status] = filter
    setFilteredOrders({...filteredOrders})
  }

  // Get orders
  useEffect(() => {
    if (loadOrders){
      adminOrdersService("index")
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
      <div className='buttons-container'>
        <Checkbox color={"#5fc21c"} text={"completed"} defaultChecked={true} onChange={(event) => filterOrders("completed", event.target.checked)}/>
        <Checkbox color={"#e88d58"} text={"pending"} defaultChecked={true} onChange={(event) => filterOrders("pending", event.target.checked)}/>
        <Checkbox color={"#7157ff"} text={"shipped"} defaultChecked={true} onChange={(event) => filterOrders("shipped", event.target.checked)}/>
        <Checkbox color={"#fb3c3f"} text={"cancelled"} defaultChecked={true} onChange={(event) => filterOrders("cancelled", event.target.checked)}/>
      </div>
      
      <ul>
          {
            orders.map((order, index) => {

              // Only render order if its status checkbox is checked
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