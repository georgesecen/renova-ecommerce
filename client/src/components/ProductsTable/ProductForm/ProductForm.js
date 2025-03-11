import React, { useState } from 'react'
import "./productForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductForm = ({productId, update, show, setShow, description, price}) => {

  // Gets data from form and updates product
  function processFormData(){
    const formData = new FormData(document.getElementById("product-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)

    // Only if description or price was changed update product
    if (entries.description !== description || Number(entries.price) !== price){
        update(productId, entries.description, Number(entries.price))
    }
  }
  
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='product-form'>
                <textarea name='description' defaultValue={"textAreaDescription"}></textarea>
                <input name='price' defaultValue={10.92} step={1} type='number' />
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {setShow(false); processFormData()}}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ProductForm