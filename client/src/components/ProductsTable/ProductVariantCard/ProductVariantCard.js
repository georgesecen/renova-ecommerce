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


  return (
    <div>
       <LabelValueDisplay labelValues={[
          ["Product Variant IDs", productVariantsIds, true],
          ["Total Stock Quantity", totalQuantity, true],
        ]}></LabelValueDisplay>
    </div>
  )
}

export default ProductVariantCard