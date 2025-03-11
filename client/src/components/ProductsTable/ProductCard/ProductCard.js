import { useState } from "react"
import "./productCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
const arrowIcon = require("../../../assets/icons/arrow.png")

const ProductCard = ({product}) => {

  const [showDropdown, setShowDropdown] = useState(false)

  // Get product details
  const {
    id: productId,
    name,
    description,
    price, 
    image: images
  } = product ?? {}

  return (
    <li className='cards-container'>

      {/* Product card which shows the product details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId],
          ["Name", name],
          ["Description", description],
          ["Images", "images"],
          ["Price", price],
        ]}></LabelValueDisplay>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

    </li>
  )
}

export default ProductCard