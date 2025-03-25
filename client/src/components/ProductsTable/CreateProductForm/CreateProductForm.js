import React from 'react'
import "./createProductForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductsService } from '../../../services/products';
import CustomFormInput from '../../CustomFormInput/CustomFormInput';
import RadioButton from '../../RadioButton/RadioButton';

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
        categoryId: Number(entries.category),
        gender: entries.gender
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
            <form id='create-product-form' className='table-form'>

                <CustomFormInput type="text" inputName="name" text="Product Name" />
                <CustomFormInput type="text" inputName="description" text="Product Description" />
                <CustomFormInput type="number" inputName="price" text="Product Price" />

                <div className='buttons-container'>
                    <RadioButton color="#7d7d7d" text="Unisex" inputName="gender" defaultChecked={true} value={"unisex"}/>
                    <RadioButton color="#7d7d7d" text="Women" inputName="gender" value={"women"}/>
                    <RadioButton color="#7d7d7d" text="Men" inputName="gender" value={"men"}/>
                </div>

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