import "./orderForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { updateOrderStatus } from "../../../services/orders";

// https://react-bootstrap.netlify.app/docs/components/modal/

/**
 * Form which updates the status of an order.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {object} order Order to be updated in the form.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadOrders Function which handles loading the orders.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} OrderForm React component.
 */
const OrderForm = ({ show, setShow, order, setLoading, setLoadOrders, displayNotification }) => {

  // Get order data
  const {id, status: orderStatus} = order ?? {}

  // Gets data from form and updates orders status
  function processFormData(){
    const formData = new FormData(document.getElementById("order-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)
    
    // Only if status was changed update order status
    if (entries.status !== orderStatus){
        setLoading(true)
        updateOrderStatus(id, entries.status)
        .then((response) => displayNotification("Update", response.data.message))
        .catch((error) => displayNotification("Update", `${error}`, "danger"))
        .finally(() => {setLoading(false); setLoadOrders(true); setShow(false)})
    }
  }
  
  // TODO: Style everything
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Status</Modal.Title>
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