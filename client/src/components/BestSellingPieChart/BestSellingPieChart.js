import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import "./bestSellingPieChart.css"

const BestSellingPieChart = ({ orders, startDate, findDate }) => {


  // Just renaming createdAt to date so data works with findDate function (Must change this)
  var parsedData = orders.map(order => ({date: new Date(order.createdAt), orderItems: order.order_items}));

  // Get the index in orders where we should begin to gather data 
  const startIndex = findDate(new Date(startDate), parsedData)

  console.log(parsedData)

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

  console.log(productCounts)

  return (
    <div className='pie-chart-container'>
        <h5>Best Selling Products</h5>
        <PieChart
            series={[
                {
                data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                ],
                },
            ]}
            height={300}
        />
    </div>
  )
}

export default BestSellingPieChart