import React, { useCallback } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
// Stripe publishable key
const stripePromise = loadStripe("pk_test_51QkxnbK1RDrGHWB8qmu8ClzOQbCZKLaRJC4VCcwAoMpdL6x9lyXA5UHelpCJl1jhLI3CPZPJ5lHYztkzs2waWkbP00CxKlz2Hx");

/**
 * Stripe checkout form which receives customer information to purchase products in
 * the cart.
 * @returns {JSX.Element}
 */
const CheckoutForm = () => {

    // TODO: Get products from the cart

    // Mock data (Actual products on Stripe server)
    const products = [
        {
            id: "000", // Stripe price id
            quantity: 1
        },
        {
            id: "123456", // Stripe price id
            quantity: 2
        },
    ]

    const fetchClientSecret = useCallback(() => {
        // Create a Stripe Checkout Session
        // TODO: Update url
        return fetch("http://localhost:3306/stripe/create-checkout-session", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({products: products}),
        })
          .then((res) => res.json())
          .then((data) => data.clientSecret);
    }, []);

    const options = {fetchClientSecret};

    // Return embeded Stripe form which will contain products in customers cart to be purchased
    // Note: The checkout form is an iframe 
    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
            >
            <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}

export default CheckoutForm