import "./orderForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// https://react-bootstrap.netlify.app/docs/components/modal/
const OrderForm = ({ show, setShow, update, orderStatus, orderId }) => {

  // Gets data from form and updates orders status
  function processFormData(){
    const formData = new FormData(document.getElementById("order-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)
    
    // Only if status was changed update order status
    if (entries.status !== orderStatus) update(orderId, entries.status)
  }
  
  // TODO: Style everything
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='order-form'>
                <input name="status" value="shipped" type="radio" defaultChecked={orderStatus === "shipped"}/>Shipped <br></br>
                <input name="status" value="cancelled" type="radio" defaultChecked={orderStatus === "cancelled"}/>Cancelled <br></br>
                <input name="status" value="pending" type="radio" defaultChecked={orderStatus === "pending"}/>Pending <br></br>
                <input name="status" value="completed" type="radio" defaultChecked={orderStatus === "completed"}/>Completed <br></br>
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

export default OrderForm