import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import "./salesBarChart.css"

const SalesBarChart = ({ orders }) => {

  // If there is no order data just display empty chart
  if (orders.length === 0){
    return (
        "No Data"
    )
  }

  // Parse out only needed data (Dates and total_price for each order) .toLocaleDateString()
  var data = orders.map(order => ({date: new Date(order.createdAt), value: Number(order.total_price)}));

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

  console.log(findDate(new Date("04/23/2025"), data))
  console.log(data)
  return ""
  

  console.log(data)

  return (
    <div>
        <BarChart
            dataset={data}
            xAxis={[{ scaleType: 'band', dataKey: "date"}]}
            series={[
                { dataKey: "value" }
            ]}
            width={500}
            height={300}
        />
    </div>
  )
}

export default SalesBarChart