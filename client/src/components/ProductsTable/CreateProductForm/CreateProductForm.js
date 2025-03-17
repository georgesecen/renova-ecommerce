import React from 'react'
import "./createProductForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductsService } from '../../../services/products';

/**
 * Form which creates a product.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadProducts Function which handles loading the products.
 * @param {function} displayNotification Function which displays toast notifications.
 * @param {Array<object>} categories All available product categories.
 * @returns {React.JSX.Element} CreateProductForm React component.
 */
const CreateProductForm = ({show, setShow, setLoading, setLoadProducts, displayNotification, categories}) => {

  // Gets data from form and creates product
  function processFormData(){
    const formData = new FormData(document.getElementById("create-product-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)

    // TODO: Add better validation before creating product (Make sure inputs are not empty)

    // Create product
    setLoading(true)
    const data = {
        name: entries.name,
        description: entries.description,
        price: Number(entries.price),
        categoryId: Number(entries.category)
    }
    adminProductsService("create", data)
        .then((response) => displayNotification("Create", response.data.message))
        .catch((error) => displayNotification("Create", `${error}`, "danger"))
        .finally(() => {setLoading(false); setLoadProducts(true)})  
  }
      
  

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='create-product-form'>
                <input name='name' type='text' placeholder='Product Name'/>
                <textarea name='description' placeholder='Product Description'></textarea>
                <input name='price' step={1} type='number' />

                {/* Product categories selector */}
                <select name='category'>
                    {
                        categories.map((category, index) => {
                            return (
                                <option key={index} value={category.id}>{category.name}</option>
                            )
                        })
                    }
                </select>
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