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

  // Function adds image to product
  function addProductImage(productId, file){
    setLoading(true)
    const data = {
      productId: productId,
      image: file
    }
    adminProductsService("add-image", data)
      .then((response) => displayNotification("Added Image", response.data.message))
      .catch((error) => displayNotification("Added Image", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadProducts(true)})  
  }

  // Function removes image from product
  function removeProductImage(fileName){
    setLoading(true)
    const data = {
      fileName: fileName
    }
    adminProductsService("remove-image", data)
      .then((response) => displayNotification("Removed Image", response.data.message))
      .catch((error) => displayNotification("Removed Image", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadProducts(true)})  
  }

  
  return (
    <div className='table-container'>
      {loading && <ModalSpinner />}
      <ul>
          {
            products.map((product, index) => {
              return <ProductCard
                key={index} 
                product={product} 
                addImage={addProductImage} 
                removeImage={removeProductImage}
                >
              </ProductCard>
            })
          }
      </ul>
    </div>
  )
}

export default ProductsTable