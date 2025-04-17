import React from 'react'
import "./productVariantCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import ActionButton from '../../ActionButton/ActionButton'

const editIcon = require("../../../assets/icons/edit.png")
const imageIcon = require("../../../assets/icons/image.png")

// Base url to get images from server
const IMAGE_BASE_URL = `${process.env.REACT_APP_BASE_URL}/static/images/`

// Note: This component is really a product variant group card component. 
// TODO: Change name to product variant group card

/**
 * Product variant group card which displays all product variant group information. Card also provides 
 * the ability to perform various actions regarding the product variant group in this card. (CRUD operations etc)
 * @param {Array<object>} productVariants All product variants which belong to product variant group.
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

  // Get total stock quantity, ids, sizes, and images used amongst all product variants
  let totalQuantity = 0
  const productVariantsIds = []
  const productVariantSizes = []
  const images = new Set()

  productVariants.forEach(productVariant => {

    totalQuantity += productVariant.stock_quantity
    productVariantsIds.push(productVariant.id)
    productVariantSizes.push(productVariant.size)

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
              <img alt="product" key={index} src={`${IMAGE_BASE_URL}${image}`}/>
            )
          })
        }
      </div>
    )
  }

  // Function displays the images form (Will be used in custom button component)
  function editImages(event){
    event.stopPropagation() // To prevent sub menu showing
    setProductVariantGroup(color)
    setProduct(product)
    setShowImageForm(true)
  }

  // Function displays the update product variants form (Will be used in custom button component)
  function updateProductVariants(event){
    event.stopPropagation() // To prevent sub menu showing
    setProductVariantGroup(color)
    setProduct(product)
    setShowUpdateProductVariantForm(true)
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

  // Displays all sizes in product variant group
  const ProductVariantSizesDisplay = () => {
    return (
      <div className='ids-display'>
        {
          productVariantSizes.map((size, index) => {
            return (
              // Display comma after every size exept the last one
              <p key={index}>{`${size}${index < productVariantsIds.length - 1 ? "," : ""}`}</p>
            )
          })
        }
      </div>
    )
  }

  return (
    <div className='card-item-container'>
       <LabelValueDisplay labelValues={[
          ["Product Variant IDs", ProductVariantIdsDisplay(), 8, false],
          ["", <ActionButton onClick={updateProductVariants} color={"#878705"} icon={editIcon} text={"Edit"}/>, 5.5, true],
          ["Color", color, 4.5, true],
          ["Sizes", ProductVariantSizesDisplay(), 7, true],
          ["Images", ImageDisplay(), 12.5, false],
          ["", <ActionButton onClick={editImages} color={"#027081"} icon={imageIcon} text={"Update Gallery"}/>, 9.5, true],
          ["Total Stock Quantity", totalQuantity, 8, false],
        ]}></LabelValueDisplay>
    </div>
  )
}

export default ProductVariantCard