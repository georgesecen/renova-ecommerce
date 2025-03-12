import React from 'react'
import "./productVariantCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'

const ProductVariantCard = ({productVariants, color}) => {

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

  return (
    <div className='card-item-container'>
       <LabelValueDisplay labelValues={[
          ["Product Variant IDs", productVariantsIds, false],
          ["", <button>edit</button>, true],
          ["Color", color, true],
          ["Images", ImageDisplay(), true],
          ["Total Stock Quantity", totalQuantity, false],
        ]}></LabelValueDisplay>
    </div>
  )
}

export default ProductVariantCard