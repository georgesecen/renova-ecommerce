import React from 'react'
import "./createProductVariantForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductVariantsService } from '../../../services/productVariants';

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
            <form id='create-product-variant-form'>

                {/* TODO: Add more color and size options */}
                <input name="color" value="Red" type="radio" />Red <br></br>
                <input name="color" value="Green" type="radio" />Green <br></br>
                <input name="color" value="Blue" type="radio" />Blue <br></br>

                <input name="size" value="S" type="radio" />S <br></br>
                <input name="size" value="M" type="radio" />M <br></br>
                <input name="size" value="L" type="radio" />L <br></br>

                {/* TODO: Show group price if a existing group (color) is selected */}
                <input name='quantity' step={1} type='number' /> quantity<br></br>
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