import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./return.css"

/**
 * Component which customer will be redirected to after checkout completion. Page will display basic order
 * details.
 * @returns {React.JSX.Element} ProductsTable React component.
 */
const Return = () => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');
        
        // Get checkout session status
        fetch(`http://localhost:3306/stripe/session-status?session_id=${sessionId}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            setStatus(data.status);
            setCustomerEmail(data.customerEmail);
            setReceiptUrl(data.receiptUrl);
          });
      }, []);
    

    // If user did not complete the checkout send them back to checkout page
    if (status === 'open') {
        return (
            <Navigate to="/test-stripe" />
        )
    }

    if (status === 'complete') {
        return (
          <section className="return-container" id="success">
            <div>
              <h1>🛍️ Order Confirmation</h1>
              <p>
                We appreciate your business! A confirmation email will be sent to {customerEmail}. 
                A receipt of your purchase can be found <a href={receiptUrl}>here</a>.
                If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
              </p>
            </div>
          </section>
        )
    }

  // TODO: Display error if page takes too long to load
  return(
    <div className="return-container">
      <div className="return-message">
        <Spinner></Spinner>
      </div>
    </div>
  )
}

export default Return