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

  console.log(images)

  // Displays images for product
  const ImageDisplay = () => {
      return (
        <div className="image-display">
          {
            images.map((image, index) => {
              return (
                // TODO: Change to actual server url
                <img alt="product" key={index} src={`http://localhost:3306/static/images/${image.image_url}`}/>
              )
            })
          }
        </div>
      )
    }

  return (
    <li className='cards-container'>

      {/* Product card which shows the product details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId, true],
          ["Name", name, true],
          ["Description", description, true],
          ["Images", ImageDisplay(), true],
          ["Price", price, false],
        ]}></LabelValueDisplay>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

    </li>
  )
}

export default ProductCard