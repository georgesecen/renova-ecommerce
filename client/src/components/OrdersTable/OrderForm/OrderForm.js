import "./orderForm.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminOrdersService } from "../../../services/orders";
import RadioButton from "../../RadioButton/RadioButton";

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

// If there is no selected order yet
  if (order === null) return

  // Get order data
  const {id: orderId, status: orderStatus} = order ?? {}

  // Gets data from form and updates orders status
  function processFormData(){
    const formData = new FormData(document.getElementById("order-form"))
    const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)
    
    // Only if status was changed update order status
    if (entries.status !== orderStatus){

        // If current order status is cancelled, then order has been refunded do not allow status change
        if (orderStatus === "cancelled"){
            displayNotification("Update", "Order has already been refunded cannot change status!", "warning")
            return
        }

        // If order status is changed to cancelled then refund order
        if (entries.status === "cancelled"){
            setLoading(true)
            adminOrdersService("refund", {orderId: orderId})
              .then((response) => displayNotification("Refund", response.data.message))
              .catch((error) => displayNotification("Refund", `${error}`, "danger"))
              .finally(() => {setLoading(false); setLoadOrders(true)})
        }

        // Otherwise just update order status to desired status
        else{
            setLoading(true)
            adminOrdersService("update", {orderId: orderId, status: entries.status})
              .then((response) => displayNotification("Update", response.data.message))
              .catch((error) => displayNotification("Update", `${error}`, "danger"))
              .finally(() => {setLoading(false); setLoadOrders(true)})
        }
    }
  }
  
  // TODO: Style everything
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='order-form' className="table-form">


                <RadioButton defaultChecked={orderStatus === "shipped"} color="#7157ff" text="Shipped" value="shipped" inputName="status" />
                <RadioButton defaultChecked={orderStatus === "cancelled"} color="#fb3c3f" text="Cancelled - Order will be fully refunded" value="cancelled" inputName="status" />
                <RadioButton defaultChecked={orderStatus === "pending"} color="#e88d58" text="Pending" value="pending" inputName="status" />
                <RadioButton defaultChecked={orderStatus === "completed"} color="#5fc21c" text="Completed" value="completed" inputName="status" />

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