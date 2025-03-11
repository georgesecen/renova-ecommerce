import React from 'react'
import "./productForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductForm = ({productId, update, show, setShow}) => {
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            form
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

export default ProductForm