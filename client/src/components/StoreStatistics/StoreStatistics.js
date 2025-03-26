import {React, useEffect, useState} from 'react'
import SalesBarChart from '../SalesBarChart/SalesBarChart'
import { adminOrdersService } from '../../services/orders'
import "./storeStatistics.css"

const StoreStatistics = ({displayNotification}) => {

    const [orders, setOrders] = useState([])

    // Keep track of date range to display data for (Default is 7 days ago)
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)))

    // Get orders
    useEffect(() => {
        adminOrdersService("index")
          .then((response) => setOrders(response.data.data))
          .catch((error) => displayNotification("Get", `${error}`, "danger"))
    }, [])


  return (
    <div>

        {/* Nav bar to set a new starting date to display data for */}
        <div>
          <button onClick={() => setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)))}>7 days</button>
          <button onClick={() => setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)))}>30 days</button>
          <button onClick={() => setStartDate(new Date(new Date().setDate(new Date().getDate() - 90)))}>90 days</button>
          <button onClick={() => setStartDate(new Date(new Date().setDate(new Date().getDate() - 365)))}>365 days</button>
        </div>


        <SalesBarChart orders={orders} startDate={startDate} />
    </div>
  )
}

export default StoreStatistics