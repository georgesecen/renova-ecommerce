import { useState } from "react"
import "./productCard.css"
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import ProductVariantCard from "../ProductVariantCard/ProductVariantCard"
import ActionButton from '../../ActionButton/ActionButton'

const arrowIcon = require("../../../assets/icons/arrow.png")
const editIcon = require("../../../assets/icons/edit.png")
const addIcon = require("../../../assets/icons/add.png")
const deleteIcon = require("../../../assets/icons/delete.png")
const imageIcon = require("../../../assets/icons/image.png")

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

  // Function displays edit images form (Will be used in custom button component)
  function editImages(event){
    event.stopPropagation() // To prevent sub menu showing
    setProduct(product)
    setShowImageForm(true)
  }

  // Function displays the update product form (Will be used in custom button component)
  function updateProduct(event){
    event.stopPropagation() // To prevent sub menu showing
    setProduct(product)
    setShowUpdateProductForm(true)
  }

  // Function displays the create product variant form (Will be used in custom button component)
  function createProductVariant(event){
    event.stopPropagation() // To prevent sub menu showing
    setProduct(product)
    setShowCreateProductVariantForm(true)
  }

  // Function displays the delete product form (Will be used in custom button component)
  function deleteProduct(event){
    event.stopPropagation() // To prevent sub menu showing
    setProduct(product)
    setShowConfirmProductDelete(true)
  }

  return (
    <li className='cards-container'>

      {/* Product card which shows the product details */}
      <div onClick={()=>{setShowDropdown(!showDropdown)}} className='card-header-container'>

        <LabelValueDisplay labelValues={[
          ["Product ID", productId, 4, false],
          ["", <ActionButton onClick={updateProduct} color={"#DF8D00"} icon={editIcon} text={"Edit"}/>, 5, false],
          ["", <ActionButton onClick={createProductVariant} color={"#04B077"} icon={addIcon} text={"Add Variant"}/>, 8, true],
          ["Name", name, 12, true],
          ["Description", description, 12.5, true],
          ["Images", ImageDisplay(), 12.5, false],
          ["", <ActionButton onClick={editImages} color={"#C301E9"} icon={imageIcon} text={"Update Gallery"}/>, 9.5, true],
          ["Price", `$${price}`, 5, false],
          ["", <ActionButton onClick={deleteProduct} color={"#C90230"} icon={deleteIcon} text={"Delete"}/>, 7, false],
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