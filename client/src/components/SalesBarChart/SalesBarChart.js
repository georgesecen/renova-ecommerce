import { useState }  from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import "./salesBarChart.css"

const SalesBarChart = ({ orders, startDate }) => {

  // Keep track of the index of the last bar which was hovered over
  const [lastBar, setLastBar] = useState(null);

  // If there is no order data just display empty chart
  if (orders.length === 0){
    return (
        "No Data"
    )
  }

  // Parse out only needed data (Dates and total_price for each order) and turn dates into date objects
  var parsedData = orders.map(order => ({date: new Date(order.createdAt), value: Number(order.total_price)}));

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

  // Build array of objects to hold total amount made and how many orders occured on each day from a starting date
  const result = []
  let current = new Date(startDate) // Start date of bar chart range
  const todaysDate = new Date()
  let index = findDate(current, parsedData) // Get index of where first occurrence of start date would be in parsed data

  // Keep track of total revenue and total orders for chart title
  let totalRevenue = 0, totalOrders = 0

  while (current < todaysDate){

    // Keep track of how many orders and the total amount made on current day is
    let orders = 0, total = 0

    // While the date in parsed data is the same date as current
    while (index < parsedData.length && current.toDateString() === parsedData[index].date.toDateString()){

      // Increase our total amount and that we have another order for current day
      total += parsedData[index].value
      totalRevenue += parsedData[index].value

      orders += 1
      totalOrders += 1
      index += 1
    }

    // Add stats for current day
    result.push({ date: current.toDateString(), revenue: total, numberOfOrders: orders})

    // Move on to next day
    current = new Date(current.setDate(current.getDate() + 1))
  }


  return (
    <div className='bar-chart-container'>
        <div className='bar-chart-title'>
          <h5>Total Sales</h5>
          <h3>${totalRevenue}</h3>
          <h6>{totalOrders} orders</h6>

          {/* Display details of last highlighted bar */}
          <p>{lastBar === null ? "‎" : `${result[lastBar].date}  Revenue: $${result[lastBar].revenue}, Orders: ${result[lastBar].numberOfOrders}`}</p>
        </div>

        <BarChart
          tooltip={{ trigger: 'none' }} // Disable tooltip as when it goes out of bounds body overflows

          // Set last bar selected to the index of the currently hovered bar
          onHighlightChange={(event) => {setLastBar(event === null ? null : event.dataIndex)}}

          dataset={result}
          xAxis={[{ 
            scaleType: 'band', 
            dataKey: "date", 
            disableTicks: true,

            // For tick labels
            valueFormatter: (date, context) =>{
              // Convert date to format MM/DD
              const month = String(new Date(date).getMonth() + 1).padStart(2, '0') // Months are 0-indexed
              const day = String(new Date(date).getDate()).padStart(2, '0')
              return `${month}/${day}`
            }
              
          }]}
          series={[
            { 
              dataKey: "revenue",
            }
          ]}
          height={300}
          >
        </BarChart>
    </div>
  )
}

export default SalesBarChart