import React, { Fragment, useEffect, useState } from 'react'
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
import ActionButton from '../ActionButton/ActionButton'

const addIcon = require("../../assets/icons/add.png")

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

  // Keep track of what product categories (by category id) are being filtered in (diplayed to admin)
  const [filteredProducts, setFilteredProducts] = useState({}) // {3: true, 2: false}

  // Function will set a category id to true or false and re render the component to filter the products
  function filterProducts(categoryId, filter){
    filteredProducts[categoryId] = filter
    setFilteredProducts({...filteredProducts})
  }

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

  // Get product categories
  useEffect(() => {
      adminProductCategoriesService("index")
        .then((response) => {
          setCategories(response.data.data)

          // Add product categories to the filtered products so admin can filter by product category
          response.data.data.map(({id: categoryId}) => {
            filteredProducts[categoryId] = true
          })
          setFilteredProducts({...filteredProducts})
        })
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
  }, [])

  // Get products
  useEffect(() => {
    if (loadProducts){
      adminProductsService("index")
        .then((response) => {setProducts(response.data.data); updateSelectedProduct(response.data.data)})
        .catch((error) => displayNotification("Get", `${error}`, "danger"))
        .finally(() => setLoadProducts(false))     
    }
  }, [loadProducts])
  
  return (
    <div className='table-container'>
      {loading && <ModalSpinner />}
      
      <ActionButton
        onClick={(event) => setShowCreateProductForm(!showCreateProductForm)}
        color={"#08A9F9"}
        icon={addIcon}
        text={"New Product"}
        >
      </ActionButton>
      
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

      {/* Update filtered categories based on if checkmarks are checked or unchecked */}
      {/* Checkboxs which are checked will be displayed */}
      {
        categories.map(({id: categoryId, name: categoryName}, index) => {
          return (
            <Fragment key={index}>
              <input type="checkbox" defaultChecked={true} onChange={(event) => filterProducts(categoryId, event.target.checked)}/> {categoryName}
            </Fragment>
          )
        })
      }

      <ul>
          {
            products.map((product, index) => {

              // Only render product if its category checkbox is checked
              if (filteredProducts[product.categoryId] === true){
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
              }
            })
            
          }
      </ul>
    </div>
  )
}

export default ProductsTable