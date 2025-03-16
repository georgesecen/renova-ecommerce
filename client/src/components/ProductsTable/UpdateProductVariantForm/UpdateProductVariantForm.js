import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "./updateProductVariantForm.css"

const UpdateProductVariantForm = ({
    show, 
    setShow
}) => {
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='update-product-variant-form'>
                
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {setShow(false)}}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default UpdateProductVariantForm