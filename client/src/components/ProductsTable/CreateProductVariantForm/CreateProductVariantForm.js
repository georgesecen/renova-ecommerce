import React from 'react'
import "./createProductVariantForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductVariantsService } from '../../../services/productVariants';
import RadioButton from '../../RadioButton/RadioButton';
import CustomFormInput from '../../CustomFormInput/CustomFormInput';

/**
 * Form which creates a product variant for a product.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {object} product Product to create product variant for.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadProducts Function which handles loading the products.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} CreateProductVariantForm React component.
 */
const CreateProductVariantForm = ({ show, setShow, product, setLoading, setLoadProducts, displayNotification }) => {

  // If there is no selected product yet
  if (product === null) return

  // Get product details
  const {
    id: productId,
    product_variants: productVariants,
    price
  } = product ?? {}

  // Get all product variant groups (product variants which share the same color)
  const productVariantGroups = {} // {color: [product variants]}
  productVariants.forEach(productVariant => {

    // If variant color does not exist add it
    if (!(productVariant.color in productVariantGroups)){
      productVariantGroups[productVariant.color] = []
    }

    // Add product variant to its group based on color
    productVariantGroups[productVariant.color].push(productVariant)
  });

  // Get all product variant group sizes
  const groupDetails = {} // {color: {sizes: {S, XL, L}, price: 49.44}}
  Object.entries(productVariantGroups).map(([color, productVariants]) => {
    groupDetails[color] = {"sizes": new Set(), "price": null}
    productVariants.forEach((productVariant) => {
      groupDetails[color]["sizes"].add(productVariant.size)
    })
  })

  // Gets data from form and creates product variant for product
  function processFormData(){
    const formData = new FormData(document.getElementById("create-product-variant-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)
 
    // If product variant with color or size for color does not already exist create product variant
    if (!(entries.color in productVariantGroups) || !(groupDetails[entries.color]["sizes"].has(entries.size))){
      
      // If product variant with color already exists we need to get a product variant id in that color group
      // so we can copy the images to this product variant
      let sourceProductVariantId = null
      if (entries.color in productVariantGroups){
        sourceProductVariantId = productVariantGroups[entries.color][0].id
      }

      setLoading(true)
      const data = {
        productId: productId,
        color: entries.color,
        size: entries.size,
        quantity: Number(entries.quantity),
        price: Number(price),
        sourceProductVariantId: sourceProductVariantId
      }
      adminProductVariantsService("create", data)
        .then((response) => displayNotification("Create", response.data.message))
        .catch((error) => displayNotification("Create", `${error}`, "danger"))
        .finally(() => {setLoading(false); setLoadProducts(true)})  
    }   
    else{
      displayNotification("Create", 
        `Product variant for ${product.name} with size ${entries.size} and color ${entries.color} already exsits.`, 
        "warning"
      )
    }   
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Create Product Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='create-product-variant-form' className='table-form'>

                {/* Color selection */}
                <h6>Select Color</h6>
                <div className='buttons-container'>
                  <RadioButton color="#FF0000" text="Red" value="red" inputName="color" />
                  <RadioButton color="#00FF00" text="Green" value="green" inputName="color" />
                  <RadioButton color="#0000FF" text="Blue" value="blue" inputName="color" />
                  <RadioButton color="#9D00FF" text="Purple" value="purple" inputName="color" />
                  <RadioButton color="#FFFF00" text="Yellow" value="yellow" inputName="color" />
                  <RadioButton color="#B1B1B1" text="White" value="white" inputName="color" />
                  <RadioButton color="#000000" text="Black" value="black" inputName="color" />
                  <RadioButton color="#FFA500" text="Orange" value="orange" inputName="color" />
                  <RadioButton color="#ff66fa" text="Pink" value="pink" inputName="color" />
                  <RadioButton color="#ffc45f" text="Beige" value="beige" inputName="color" />
                  <RadioButton color="#964B00" text="Brown" value="brown" inputName="color" />
                  <RadioButton color="#808080" text="Grey" value="grey" inputName="color" />
                </div>

                {/* Size selection */}
                <h6>Select Size</h6>
                <div className='buttons-container'>
                  <RadioButton color="#7d7d7d" text="Extra Small" value="XS" inputName="size" />
                  <RadioButton color="#7d7d7d" text="Small" value="S" inputName="size" />
                  <RadioButton color="#7d7d7d" text="Medium" value="M" inputName="size" />
                  <RadioButton color="#7d7d7d" text="Large" value="L" inputName="size" />
                  <RadioButton color="#7d7d7d" text="Extra Large" value="XL" inputName="size" />
                </div>

                <CustomFormInput type="number" inputName="quantity" text="Quantity" />

            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {setShow(false); processFormData()}}>
                Create
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateProductVariantForm