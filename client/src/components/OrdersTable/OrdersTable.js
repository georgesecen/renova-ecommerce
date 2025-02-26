import React from 'react'
import OrderCard from './OrderCard/OrderCard'
import "./ordersTable.css"

const OrdersTable = () => {
  return (
    <div className='order-table-container'>
        <OrderCard></OrderCard>
    </div>
  )
}

export default OrdersTable