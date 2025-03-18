import React, { useEffect, useState } from 'react'
import "./productsTable.css"
import ModalSpinner from '../ModalSpinner/ModalSpinner'
import ProductCard from './ProductCard/ProductCard'
import { adminProductsService } from '../../services/products'
import { adminProductCategoriesService } from '../../services/productCategories'
import CreateProductForm from './CreateProductForm/CreateProductForm'
import UpdateProductForm from './UpdateProductForm/UpdateProductForm'
import CreateProductVariantForm from './CreateProductVariantForm/CreateProductVariantForm'
import ImageForm from './ImageForm/ImageForm'
import UpdateProductVariantForm from './UpdateProductVariantForm/UpdateProductVariantForm'
import ConfirmProductDelete from './ConfirmProductDelete/ConfirmProductDelete'

/**
 * Gets all of the products + product variants information in the database. Displays all the information
 * in product/product variant card components. Gives the admin the ability to perform operations on all
 * product/product variant related items. (CRUD operations etc)
 * @param {function} displayNotification Function which handles displaying toast notifications.
 * @returns {React.JSX.Element} ProductsTable React component.
 */
const ProductsTable = ({displayNotification}) => {

  const [categories, setCategories] = useState([])

  const [products, setProducts] = useState([])
  const [loadProducts, setLoadProducts] = useState(true) // When set to true will trigger reload of products
  const [loading, setLoading] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProductVariantGroup, setSelectedProductVariantGroup] = useState(null) // Group for selected product

  const [showCreateProductForm, setShowCreateProductForm] = useState(false)
  const [showUpdateProductForm, setShowUpdateProductForm] = useState(false)
  const [showCreateProductVariantForm, setShowCreateProductVariantForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [showUpdateProductVariantForm, setShowUpdateProductVariantForm] = useState(false)
  const [showConfirmProductDelete, setShowConfirmProductDelete] = useState(false)

  // Function updates the currently selected product. This way in the image form, after adding an image
  // the image form will get the updated product with the new image added. No need to close the form and 
  // reopen it.
  function updateSelectedProduct(products){
    // If there is a selected product
    if (selectedProduct !== null){

      // Get updated version of current selected product
      const selectedProductId = selectedProduct.id
      const updatedProduct = products.find(product => product.id === selectedProductId)

      // Update current selected product to its updated self
      setSelectedProduct(updatedProduct)
    }
  }

  // Get products and product categories
  useEffect(() => {
    if (loadProducts){
      adminProductsService("index")
        .then((response) => {setProducts(response.data.data); updateSelectedProduct(response.data.data)})
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
        .finally(() => setLoadProducts(false))     
      
      adminProductCategoriesService("index")
        .then((response) => setCategories(response.data.data))
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
    }
  }, [loadProducts])
  
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
        categories={categories}
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

      <ImageForm
        show={showImageForm} 
        setShow={setShowImageForm}
        setLoading={setLoading}
        setLoadProducts={setLoadProducts}
        product={selectedProduct}
        productVariantGroup={selectedProductVariantGroup}
        setProductVariantGroup={setSelectedProductVariantGroup}
        displayNotification={displayNotification}
        >
      </ImageForm>

      <UpdateProductVariantForm
        show={showUpdateProductVariantForm}
        setShow={setShowUpdateProductVariantForm}
        setLoading={setLoading}
        setLoadProducts={setLoadProducts}
        product={selectedProduct}
        productVariantGroup={selectedProductVariantGroup}
        setProductVariantGroup={setSelectedProductVariantGroup}
        displayNotification={displayNotification}
        >
      </UpdateProductVariantForm>

      <ConfirmProductDelete
        show={showConfirmProductDelete} 
        setShow={setShowConfirmProductDelete}
        setLoading={setLoading}
        setLoadProducts={setLoadProducts}
        product={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        displayNotification={displayNotification}
        >
      </ConfirmProductDelete>

      <ul>
          {
            products.map((product, index) => {
              return <ProductCard
                key={index} 
                product={product} 
                setProduct={setSelectedProduct}
                setProductVariantGroup={setSelectedProductVariantGroup}
                setShowUpdateProductForm={setShowUpdateProductForm}
                setShowCreateProductVariantForm={setShowCreateProductVariantForm}
                setShowImageForm={setShowImageForm}
                setShowUpdateProductVariantForm={setShowUpdateProductVariantForm}
                setShowConfirmProductDelete={setShowConfirmProductDelete}
                >
              </ProductCard>
            })
          }
      </ul>
    </div>
  )
}

export default ProductsTable