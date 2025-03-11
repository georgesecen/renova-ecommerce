import { useState } from "react"
import "./productCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import ImageForm from "../ImageForm/ImageForm"
import ProductForm from "../ProductForm/ProductForm"
const arrowIcon = require("../../../assets/icons/arrow.png")

const ProductCard = ({product, addImage, removeImage}) => {

  const [showDropdown, setShowDropdown] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)

  // Get product details
  const {
    id: productId,
    name,
    description,
    price, 
    image: images
  } = product ?? {}

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

      <ImageForm
        show={showImageForm} 
        setShow={setShowImageForm} 
        addImage={addImage} 
        removeImage={removeImage} 
        productId={productId}
        productImages={images}
        >
      </ImageForm>

      <ProductForm show={showProductForm} setShow={setShowProductForm}/>

      {/* Product card which shows the product details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId, false],
          ["", <button onClick={() => setShowProductForm(!showProductForm)}>edit</button>, true],
          ["Name", name, true],
          ["Description", description, true],
          ["Images", ImageDisplay(), false],
          ["", <button onClick={() => setShowImageForm(!showImageForm)}>edit</button>, true],
          ["Price", price, false],
        ]}></LabelValueDisplay>

        {/* Arrow icon which shows sub menu is open */}
        <img src={arrowIcon} alt='Edit' className={showDropdown ? "show" : ""}/>

      </div>

    </li>
  )
}

export default ProductCard