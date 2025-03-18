import { useState } from "react"
import "./productCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import ProductVariantCard from "../ProductVariantCard/ProductVariantCard"
const arrowIcon = require("../../../assets/icons/arrow.png")

/**
 * Product card which displays all product information. Card also provides the ability to perform various
 * actions regarding the product in this product card. (CRUD operations etc)
 * @param {object} product Product to be used in this product card.
 * @param {function} setProduct Function which handles setting the current selected product for actions.
 * @param {function} setProductVariantGroup Function which handles selecting the product variant group for actions.
 * @param {function} setShowUpdateProductForm Function which handles displaying the update product form.
 * @param {function} setShowCreateProductVariantForm Function which handles displaying the create product variant form.
 * @param {function} setShowImageForm Function which handles displaying the image form.
 * @param {function} setShowUpdateProductVariantForm Function which handles displaying the update product variant form.
 * @param {function} setShowConfirmProductDelete Function which handles displaying the delete product confirmation modal.
 * @returns {React.JSX.Element} ProductCard React component.
 */
const ProductCard = ({
  product, 
  setProduct, 
  setProductVariantGroup,
  setShowUpdateProductForm,
  setShowCreateProductVariantForm,
  setShowImageForm,
  setShowUpdateProductVariantForm,
  setShowConfirmProductDelete
}) => {

  const [showDropdown, setShowDropdown] = useState(false)

  // Get product details
  const {
    id: productId,
    name,
    description,
    price, 
    image: images,
    product_variants: productVariants
  } = product ?? {}

  // Get all image urls which belong to just product
  const productImages = []
  images.forEach((image) => productImages.push(image.image_url))
  
  // Get all product variant groups (product variants which share the same color)
  const productVariantGroups = {}
  productVariants.forEach(productVariant => {

    // If variant color does not exist add it
    if (!(productVariant.color in productVariantGroups)){
      productVariantGroups[productVariant.color] = []
    }

    // Add product variant to its group based on color
    productVariantGroups[productVariant.color].push(productVariant)
  });

  // Displays images for product
  const ImageDisplay = () => {
      return (
        <div className="image-display">
          {
            productImages.map((image, index) => {
              return (
                // TODO: Change to actual server url
                <img alt="product" key={index} src={`http://localhost:3306/static/images/${image}`}/>
              )
            })
          }
        </div>
      )
  }

  // Edit images button
  const EditImagesButton = () => {
    return (
      <button 
        onClick={(event)=>{

          // Display the images form for product
          event.stopPropagation() // To prevent sub menu showing
          setProduct(product)
          setShowImageForm(true)
        }} 
      >
        Edit
      </button>
    )
  }

  // Edit product button
  const EditProductButton = () => {
    return (
      <button 
        onClick={(event)=>{

          // Display the update product form for product
          event.stopPropagation() // To prevent sub menu showing
          setProduct(product)
          setShowUpdateProductForm(true)
        }} 
      >
        Edit
      </button>
    )
  }

  // Create product variant button
  const CreateProductVariantButton = () => {
    return (
      <button 
        onClick={(event)=>{

          // Display the create product variant form for product
          event.stopPropagation() // To prevent sub menu showing
          setProduct(product)
          setShowCreateProductVariantForm(true)
        }} 
      >
        Create Variant
      </button>
    )
  }

  // Delete product button
  const DeleteProductButton = () => {
    return (
      <button 
        onClick={(event)=>{

          // Display the delete product confirmation modal
          event.stopPropagation() // To prevent sub menu showing
          setProduct(product)
          setShowConfirmProductDelete(true)
        }} 
      >
        Delete
      </button>
    )
  }

  return (
    <li className='cards-container'>

      {/* Product card which shows the product details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId, false],
          ["", CreateProductVariantButton(), false],
          ["", DeleteProductButton(), false],
          ["", EditProductButton(), true],
          ["Name", name, true],
          ["Description", description, true],
          ["Images", ImageDisplay(), false],
          ["", EditImagesButton(), true],
          ["Price", `$${price}`, false],
        ]}></LabelValueDisplay>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

      {/* Dropdown which displays product variants (product variant groups) for product */}
      <ul className={`card-items-container ${showDropdown ? "show" : ""}`}>
        {
          Object.entries(productVariantGroups).map(([color, productVariants], index) => {
            return (
              <li key={index}>
                <ProductVariantCard
                  productVariants={productVariants} 
                  color={color}
                  setProductVariantGroup={setProductVariantGroup}
                  setShowImageForm={setShowImageForm}
                  setShowUpdateProductVariantForm={setShowUpdateProductVariantForm}
                  product={product}
                  setProduct={setProduct}
                  >
                </ProductVariantCard>
              </li>
            )
          })
        }
      </ul>

    </li>
  )
}

export default ProductCard