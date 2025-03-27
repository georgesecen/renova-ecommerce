import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import "./bestSellingPieChart.css"

/**
 * Displays sales by product in pie chart. 
 * @param {Array<object>} orders Orders to display data for.
 * @param {Date} startDate Date for when to start displaying data.
 * @param {function} findDate Function which finds what index the startDate should be at in orders.
 * @returns {React.JSX.Element} BestSellingPieChart React component.
 */
const BestSellingPieChart = ({ orders, startDate, findDate }) => {

  // If there is no order data add empty object to display empty chart
  if (orders.length === 0) orders.push({})

  // Just renaming createdAt to date so data works with findDate function (Must change this)
  var parsedData = orders.map(order => ({date: new Date(order.createdAt), orderItems: order.order_items}));

  // Get the index in orders where we should begin to gather data 
  const startIndex = findDate(new Date(startDate), parsedData)

  // Get the counts of all the purchased products (How many times each product was purchased from start date)
  const productCounts = {}
  for (let i = startIndex; i < parsedData.length; i++) {
    parsedData[i].orderItems.forEach(orderItem => {

      // Get name of product purchased
      const name =  orderItem.product_variant.product.name

      // If product does not exist in product counts add it so we can keep track of it
      if (!(name in productCounts)) productCounts[name] = 0

      productCounts[orderItem.product_variant.product.name] += 1
    })
  }

  // Now that we have the counts of all the products lets turn it into an array of objects so
  // the pie chart can display the data
  const result = []
  Object.entries(productCounts).forEach(([productName, productCount], index) => {
    result.push({ id: index, value: productCount, label: productName })
  })

  return (
    <div className='pie-chart-container'>
        <h5>Sales By Product</h5>
        <PieChart
            tooltip={{ trigger: 'none' }} // Disable tooltip as when it goes out of bounds body overflows
            series={[{data: result}]}
            height={300}
        />
    </div>
  )
}

export default BestSellingPieChart