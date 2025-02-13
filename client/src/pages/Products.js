import React from 'react'
import ProductItem from '../components/ProductItem'
import '../styles/productsPage.css'

function Products(props) {

  return (
    <div className="products-page">
      <h1>Products</h1>
        <ProductItem />
    </div>
  )
}

export default Products
