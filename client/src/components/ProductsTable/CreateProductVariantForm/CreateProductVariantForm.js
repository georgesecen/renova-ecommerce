import React from 'react'
import "./createProductVariantForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CreateProductVariantForm = ({show, setShow, productId, productVariantGroups}) => {

  // Get sizes and price for every product variant group
  const groupDetails = {} // {color: {sizes: [S, M], price: 29,50}}
  Object.entries(productVariantGroups).forEach(([color, productVariants], index) => {
    groupDetails[color] = {}
    groupDetails[color]["sizes"] = new Set()
    productVariants.forEach((productVariant) => {
        groupDetails[color]["sizes"].add(productVariant.size)
        groupDetails[color]["price"] = Number(productVariant.price)
    })
  })
  console.log(groupDetails)



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