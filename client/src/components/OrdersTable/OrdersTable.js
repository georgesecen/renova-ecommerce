import React from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"

const OrdersTable = () => {
  return (
    <div className='order-table-container'>
        <OrderCard status={"completed"}></OrderCard>
    </div>
  )
}

export default OrdersTable