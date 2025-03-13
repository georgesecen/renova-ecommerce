import React, { useEffect, useState } from 'react'
import "./productsTable.css"
import ModalSpinner from '../ModalSpinner/ModalSpinner'
import ProductCard from './ProductCard/ProductCard'
import { adminProductsService } from '../../services/products'
import { adminProductVariantsService } from '../../services/productVariants'
import CreateProductForm from './CreateProductForm/CreateProductForm'
import UpdateProductForm from './UpdateProductForm/UpdateProductForm'
import CreateProductVariantForm from './CreateProductVariantForm/CreateProductVariantForm'

const ProductsTable = ({displayNotification}) => {

  const [products, setProducts] = useState([])
  const [loadProducts, setLoadProducts] = useState(true) // When set to true will trigger reload of products
  const [loading, setLoading] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCreateProductForm, setShowCreateProductForm] = useState(false)
  const [showUpdateProductForm, setShowUpdateProductForm] = useState(false)
  const [showCreateProductVariantForm, setShowCreateProductVariantForm] = useState(false)

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

  // Function creates product variant for a product
  function createProductVariant(productId, color, quantity, size, price, sourceProductVariantId){
    setLoading(true)
    const data = {
      productId: productId,
      color: color,
      size: size,
      quantity: quantity,
      price: price, 
      sourceProductVariantId: sourceProductVariantId
    }
    adminProductVariantsService("create", data)
      .then((response) => displayNotification("Create", response.data.message))
      .catch((error) => displayNotification("Create", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadProducts(true)})  
  }
  
  return (
    <div className='table-container'>
      {loading && <ModalSpinner />}
      <button onClick={() => setShowCreateProductForm(!showCreateProductForm)}>Create Product</button>
      
      <CreateProductForm
        show={showCreateProductForm} 
        setShow={setShowCreateProductForm}
        setLoading={setLoading}
        setLoadProducts={setLoadProducts}
        displayNotification={displayNotification}
        >
      </CreateProductForm>

      <UpdateProductForm
        show={showUpdateProductForm} 
        setShow={setShowUpdateProductForm}
        setLoading={setLoading}
        setLoadProducts={setLoadProducts}
        product={selectedProduct}
        displayNotification={displayNotification}
        >
      </UpdateProductForm>

      <CreateProductVariantForm
        show={showCreateProductVariantForm} 
        setShow={setShowCreateProductVariantForm}
        setLoading={setLoading}
        setLoadProducts={setLoadProducts}
        product={selectedProduct}
        displayNotification={displayNotification}
        >
      </CreateProductVariantForm>

      <ul>
          {
            products.map((product, index) => {
              return <ProductCard
                key={index} 
                product={product} 
                addImage={addProductImage} 
                removeImage={removeProductImage}
                setProduct={setSelectedProduct}
                setShowUpdateProductForm={setShowUpdateProductForm}
                setShowCreateProductVariantForm={setShowCreateProductVariantForm}
                >
              </ProductCard>
            })
          }
      </ul>
    </div>
  )
}

export default ProductsTable