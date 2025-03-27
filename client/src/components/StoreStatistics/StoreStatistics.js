import {React, useEffect, useState} from 'react'
import SalesBarChart from '../SalesBarChart/SalesBarChart'
import { adminOrdersService } from '../../services/orders'
import "./storeStatistics.css"
import BestSellingPieChart from '../BestSellingPieChart/BestSellingPieChart'

const StoreStatistics = ({displayNotification}) => {

  const [orders, setOrders] = useState([])

  // Keep track of date range to display data for (Default is 7 days ago)
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString())
  const [timeframe, setTimeframe] = useState("7 days") // Mainly used to put selected class on selected button

  // Get orders
  useEffect(() => {
      adminOrdersService("index")
        .then((response) => setOrders(response.data.data))
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
  }, [])

  // Function finds where in data (what index) the first occurence of date would be
  function findDate(targetDate, data){
    let left = 0, right = data.length - 1

    while (left <= right){
      const mid = Math.floor((right + left) / 2)
      
      // If date at mid is after our target
      if (data[mid].date > targetDate){
        right = mid - 1
      }

      // If date at mid is before than our target
      else{
        left = mid + 1
      }
    }

    // Return what index in data targetDate would be at
    return right + 1
  }


  return (
    <div className='user-dash-statistics-container'>

        {/* Nav bar to set a new starting date to display data for */}
        <div className='statistics-navbar'>
          <button
            className={timeframe === "7 days" ? "selected" : ""}
            onClick={() => {setTimeframe("7 days"); setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)).toDateString())}}
            >
            7 days
          </button>
          <button
            className={timeframe === "30 days" ? "selected" : ""}
            onClick={() => {setTimeframe("30 days"); setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)).toDateString())}}
            >
            30 days
          </button>
          <button
            className={timeframe === "90 days" ? "selected" : ""}
            onClick={() => {setTimeframe("90 days"); setStartDate(new Date(new Date().setDate(new Date().getDate() - 90)).toDateString())}}
            >
            90 days
          </button>
          <button
            className={timeframe === "365 days" ? "selected" : ""}
            onClick={() => {setTimeframe("365 days"); setStartDate(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString())}}
            >
            365 days
          </button>
        </div>


        <SalesBarChart orders={orders} startDate={new Date(startDate)} findDate={findDate} />
        <BestSellingPieChart orders={orders} startDate={new Date(startDate)} findDate={findDate} />
    </div>
  )
}

export default StoreStatistics