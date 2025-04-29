import React from 'react'
import "./updateProductForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductsService } from '../../../services/products';
import CustomFormInput from '../../CustomFormInput/CustomFormInput';

/**
 * Form which updates product description and price.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {object} product Product to be updated in the form.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadProducts Function which handles loading the products.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} UpdateProductForm React component.
 */
const UpdateProductForm = ({ show, setShow, product, setLoading, setLoadProducts, displayNotification }) => {

  // If there is no selected product yet
  if (product === null) return

  // Get product details
  const {id: productId, price, description} = product ?? {}

  // Gets data from form and updates product
  function processFormData(){
    const form = document.getElementById("update-product-form")

    // If form is invalid display what form inputs are missing to admin
    if (!form.checkValidity()){
        form.reportValidity()
        return
    }

    const formData = new FormData(form)
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)

    // Only if description or price was changed update product
    if (entries.description !== description || entries.price !== price){
        setLoading(true)
        const data = {
            productId: productId,
            description: entries.description,
            price: Number(entries.price)
        }
        adminProductsService("update", data)
            .then((response) => displayNotification("Update", response.data.message))
            .catch((error) => displayNotification("Update", `${error}`, "danger"))
            .finally(() => {setLoading(false); setLoadProducts(true)})  
        
        // Close form
        setShow(false)
    }
  }
  
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='update-product-form' className='table-form'>

                <CustomFormInput type="text" inputName="description" text="New Product Description" defaultValue={description}/>
                <CustomFormInput type="number" min={0} max={10000} inputName="price" text="New Product Price" defaultValue={price}/>

            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => processFormData()}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default UpdateProductForm