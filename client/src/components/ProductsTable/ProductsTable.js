import React, { useEffect, useState } from 'react'
import "./productsTable.css"
import ModalSpinner from '../ModalSpinner/ModalSpinner'
import ProductCard from './ProductCard/ProductCard'
import { adminProductsService } from '../../services/products'

const ProductsTable = ({displayNotification}) => {

  const [products, setProducts] = useState([])
  const [loadProducts, setLoadProducts] = useState(true) // When set to true will trigger reload of products
  const [loading, setLoading] = useState(false)

  // Get products
  useEffect(() => {
    if (loadProducts){
      adminProductsService("index")
        .then((response) => setProducts(response.data.data))
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
        .finally(() => setLoadProducts(false))
    }
  }, [loadProducts])

  
  return (
    <div className='table-container'>
      {loading && <ModalSpinner />}
      <ul>
          {
            products.map((product, index) => {
              return <ProductCard key={index} product={product}/>
            })
          }
      </ul>
    </div>
  )
}

export default ProductsTable