import React from 'react'
import "./productVariantCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'

// Note: This component is really a product variant group card component. 
// TODO: Change name to product variant group card

/**
 * Product variant group card which displays all product variant group information. Card also provides 
 * the ability to perform various actions regarding the product variant group in this card. (CRUD operations etc)
 * @param {Array<object>} productVariants All product variants which belong to product.
 * @param {string} color Product variant group to parse from productVariants.
 * @param {function} setProductVariantGroup Function handles setting the current selected product variant group for actions. (Color)
 * @param {function} setShowImageForm Function which handles displaying the image form.
 * @param {function} setShowUpdateProductVariantForm Function which handles displaying the update product variant form.
 * @param {object} product Product which product variants belong to.
 * @param {function} setProduct Function which handles setting the current selected product for actions.
 * @returns {React.JSX.Element} ProductVariantCard React component.
 */
const ProductVariantCard = ({
  productVariants, 
  color, 
  setProductVariantGroup, 
  setShowImageForm, 
  setShowUpdateProductVariantForm,
  product, 
  setProduct
}) => {

  // Get total stock quantity, ids and images used amongst all product variants
  let totalQuantity = 0
  const productVariantsIds = []
  const images = new Set()

  productVariants.forEach(productVariant => {

    totalQuantity += productVariant.stock_quantity
    productVariantsIds.push(productVariant.id)

    productVariant.images.forEach((image) => {
        images.add(image.image_url)
    })
  });

  // Displays images for product variant group
  const ImageDisplay = () => {
    return (
      <div className="image-display">
        {
          [...images].map((image, index) => {
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

          // Display the images form for product variant group
          event.stopPropagation() // To prevent sub menu showing
          setProductVariantGroup(color)
          setProduct(product)
          setShowImageForm(true)
        }} 
      >
        Edit
      </button>
    )
  }

  // Edit product variants button
  const EditProductVariantsButton = () => {
    return (
      <button 
        onClick={(event)=>{

          // Display the uodate product variants form for product variant group
          event.stopPropagation() // To prevent sub menu showing
          setProductVariantGroup(color)
          setProduct(product)
          setShowUpdateProductVariantForm(true)
        }} 
      >
        Edit
      </button>
    )
  }

  // Displays all IDs in product variant group
  const ProductVariantIdsDisplay = () => {
    return (
      <div className='ids-display'>
        {
          productVariantsIds.map((productVariantId, index) => {
            return (
              // Display comma after every ID exept the last one
              <p key={index}>{`${productVariantId}${index < productVariantsIds.length - 1 ? "," : ""}`}</p>
            )
          })
        }
      </div>
    )
  }

  return (
    <div className='card-item-container'>
       <LabelValueDisplay labelValues={[
          ["Product Variant IDs", ProductVariantIdsDisplay(), false],
          ["", EditProductVariantsButton(), true],
          ["Color", color, true],
          ["Images", ImageDisplay(), false],
          ["", EditImagesButton(), true],
          ["Total Stock Quantity", totalQuantity, false],
        ]}></LabelValueDisplay>
    </div>
  )
}

export default ProductVariantCard