import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductCategoriesService } from '../../../services/productCategories';
import CustomFormInput from '../../CustomFormInput/CustomFormInput';

/**
 * Form which creates a product category.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadCategories Function which handles loading the categories.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} CreateCategoryForm React component.
 */
const CreateCategoryForm = ({ show, setShow, setLoading, setLoadCategories, displayNotification }) => {

  // Gets data from form and creates product category
  function processFormData(){
    const form = document.getElementById("create-category-form")

    // If form is invalid display what form inputs are missing to admin
    if (!form.checkValidity()){
        form.reportValidity()
        return
    }

    const formData = new FormData(form)
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)

    // Create product category
    setLoading(true)
    adminProductCategoriesService("create", {name: entries.name})
      .then((response) => displayNotification("Create", response.data.message))
      .catch((error) => displayNotification("Create", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadCategories(true)})  
    
    // Close form
    setShow(false)
  }


  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Create Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='create-category-form' className='table-form'>

                <CustomFormInput type="text" inputName="name" text="Category Name" />

            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => processFormData()}>
                Create
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateCategoryForm