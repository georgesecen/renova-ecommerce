import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductsService } from '../../../services/products';
import "./confirmProductDelete.css"

/**
 * Confirmation modal which informs the admin of consequences when deleting a product, and deletes a product
 * if confirmed.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {object} product Product to be deleted.
 * @param {function} setSelectedProduct Function which handles setting the currently selected product for actions.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadProducts Function which handles loading the products.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} ConfirmProductDelete React component.
 */
const ConfirmProductDelete = ({ 
    show, 
    setShow, 
    product, 
    setSelectedProduct,
    setLoading, 
    setLoadProducts, 
    displayNotification
 }) => {

  // If there is no selected product yet
  if (product === null) return 

  // Function deletes product and all associated product variants and images from database, server and Stripe
  function deleteProduct(){
    setLoading(true)
    adminProductsService("delete", {productId: product.id})
        .then((response) => displayNotification("Delete", response.data.message))
        .catch((error) => displayNotification("Delete", `${error}`, "danger"))
        .finally(() => {
            setSelectedProduct(null) // Product does not exist anymore
            setLoading(false)
            setLoadProducts(true)
        })  
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Product #{product.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='confirm-delete'>
                Are you certain you would like to delete this product? Product, product variants, and all associated 
                images will be deleted. Deletion is permanent. There is no undo.
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="danger" onClick={() => {setShow(false); deleteProduct()}}>
                Delete
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ConfirmProductDelete