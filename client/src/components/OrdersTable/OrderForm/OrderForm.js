import React, { useEffect, useState } from 'react'
import "./orderForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// https://react-bootstrap.netlify.app/docs/components/modal/
const OrderForm = () => {

  const [show, setShow] = useState(true)

  function getFormData(){
    const formData = new FormData(document.getElementById("order-form"))
    console.log(Object.fromEntries(formData.entries()))
  }
  
  // TODO: Style everything
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='order-form'>
                <input name="status" value="shipped" type="radio"/>Shipped <br></br>
                <input name="status" value="canceled" type="radio"/>Canceled <br></br>
                <input name="status" value="pending" type="radio"/>Pending <br></br>
                <input name="status" value="completed" type="radio"/>Completed <br></br>
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {setShow(false); getFormData()}}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default OrderForm