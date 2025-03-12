import { useState } from "react"
import "./productCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import ImageForm from "../ImageForm/ImageForm"
import ProductForm from "../UpdateProductForm/UpdateProductForm"
import CreateProductVariantForm from "../CreateProductVariantForm/CreateProductVariantForm"
import ProductVariantCard from "../ProductVariantCard/ProductVariantCard"
const arrowIcon = require("../../../assets/icons/arrow.png")

const ProductCard = ({product, addImage, removeImage, update}) => {

  const [showDropdown, setShowDropdown] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCreateProductVariantForm, setShowCreateProductVariantForm] = useState(false)

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
          event.stopPropagation() // To prevent sub menu showing
          setShowImageForm(!showImageForm)
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
          event.stopPropagation() // To prevent sub menu showing
          setShowProductForm(!showProductForm)
        }} 
      >
        Edit
      </button>
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
        productImages={productImages}
        >
      </ImageForm>

      <ProductForm
        show={showProductForm} 
        setShow={setShowProductForm}
        productId={productId}
        description={description}
        price={price}
        update={update}
        >
      </ProductForm>
      <CreateProductVariantForm
        show={showCreateProductVariantForm}
        setShow={setShowCreateProductVariantForm}
        productId={productId}
        productVariantGroups={productVariantGroups}
        >
      </CreateProductVariantForm>

      {/* Product card which shows the product details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId, false],
          ["", <button onClick={() => setShowCreateProductVariantForm(!showCreateProductVariantForm)}>variant</button>, false],
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
                <ProductVariantCard productVariants={productVariants} color={color}/>
              </li>
            )
          })
        }
      </ul>

    </li>
  )
}

export default ProductCard