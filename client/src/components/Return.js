import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

/**
 * Component which customer will be redirected to after checkout completion.
 * @returns {JSX.Element}
 */
const Return = () => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        console.log("isduhfi")
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
          });
      }, []);
    

    // If user did not complete the checkout send them back to checkout page
    // TODO: Give user message that checkout was not successful 
    if (status === 'open') {
        return (
            <Navigate to="/test-stripe" />
        )
    }

    // TODO: Maybe send user back to home page with a message letting them know checkout was successful
    if (status === 'complete') {
        return (
          <section id="success">
            <p>
              We appreciate your business! A confirmation email will be sent to {customerEmail}.
              If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
            </p>
          </section>
        )
    }

  return(
    <div>Null</div>
  )
}

export default Return