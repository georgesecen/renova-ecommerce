import React from 'react'
import "./productCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'

const ProductCard = ({product}) => {


  // Get product details
  const {
    id: productId,
    name,
    description,
    price, 
    image: images
  } = product ?? {}

  return (
    <li>

      {/* Product card which shows the product details */}
      <div>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId],
          ["Name", name],
          ["Description", description],
          ["Images", "images"],
          ["Price", price],
        ]}></LabelValueDisplay>

      </div>

    </li>
  )
}

export default ProductCard