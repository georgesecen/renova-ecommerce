import React, { useState } from 'react'
import "./orderForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// https://react-bootstrap.netlify.app/docs/components/modal/
const OrderForm = () => {

  const [show, setShow] = useState(true)

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => setShow(false)}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default OrderForm