import {React, useEffect, useState} from 'react'
import SalesBarChart from '../SalesBarChart/SalesBarChart'
import { adminOrdersService } from '../../services/orders'
import "./storeStatistics.css"

const StoreStatistics = ({displayNotification}) => {

    const [orders, setOrders] = useState([])

    // Get orders
    useEffect(() => {
        adminOrdersService("index")
          .then((response) => setOrders(response.data.data))
          .catch((error) => displayNotification("Get", `${error}`, "danger"))
    }, [])


  return (
    <div>
        <SalesBarChart orders={orders} />
    </div>
  )
}

export default StoreStatistics