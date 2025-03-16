import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "./confirmProductDelete.css"

const ConfirmProductDelete = ({ show, setShow, product, setLoading, setLoadProducts, displayNotification }) => {

  const [disableDeleteButton, setDisableDeleteButton] = useState(true)

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you certain you would like to delete this product? Product, product variants, and all associated 
            images will be deleted. Deletion is permanent. There is no undo.
            <button onClick={() => setDisableDeleteButton(false)}>Are you sure?</button>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="danger" disabled={disableDeleteButton} onClick={() => {setShow(false)}}>
                Delete
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ConfirmProductDelete