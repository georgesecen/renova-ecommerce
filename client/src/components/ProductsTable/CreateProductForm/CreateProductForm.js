import React from 'react'
import "./createProductForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CreateProductForm = ({show, setShow, create}) => {

  // Gets data from form and creates product
  function processFormData(){
    const formData = new FormData(document.getElementById("create-product-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)

    // Create product
    create(entries.name, entries.description, Number(entries.price))
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='create-product-form'>
                <input name='name' type='text' placeholder='Product Name'/>
                <textarea name='description' placeholder='Product Description'></textarea>
                <input name='price' step={1} type='number' />
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

export default CreateProductForm