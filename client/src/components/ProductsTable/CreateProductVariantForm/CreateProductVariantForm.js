import React from 'react'
import "./createProductVariantForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CreateProductVariantForm = ({ show, setShow, product, setLoading, setLoadProducts, displayNotification }) => {

  // If there is no selected product yet
  if (product === null) return

  // Get product details
  const {
    id: productId,
    product_variants: productVariants
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
  const groupSizes = {} // {color: {S, XL, L}}
  Object.entries(productVariantGroups).map(([color, productVariants]) => {
    groupSizes[color] = new Set()
    productVariants.forEach((productVariant) => groupSizes[color].add(productVariant.size))
  })

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
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

                <input name='quantity' step={1} type='number' /> <br></br>
                <input name='price' step={1} type='number' /> <br></br>
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {setShow(false)}}>
                Create
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateProductVariantForm