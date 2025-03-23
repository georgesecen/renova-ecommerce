import React from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { getCartItems } from "../services/cart";
import { useUser } from "../providers/UserContext"

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
// Stripe publishable key
const stripePromise = loadStripe("pk_test_51QkxnbK1RDrGHWB8qmu8ClzOQbCZKLaRJC4VCcwAoMpdL6x9lyXA5UHelpCJl1jhLI3CPZPJ5lHYztkzs2waWkbP00CxKlz2Hx");

/**
 * Stripe checkout form which receives customer information to purchase products in
 * the cart.
 * @returns {React.JSX.Element} CheckoutForm React component.
 */
const CheckoutForm = () => {

    // Get customer IDs so we know which customer to create order for
    const { user } = useUser()
    const userId = user === null ? null : user.userId
    const guestUserId = localStorage.getItem("guestUserId")

    // Function gets all products and quantities in customers cart
    // Returns Array<object> which contains product variant ids, and quantity
    // [{id: "3", quantity: 5}, {id: "7", quantity: 1}]
    async function getCartProducts(){
        let cartProducts = []
        await getCartItems()
          .then((response) => {
            cartProducts = response.map(cartItem => (
                {
                    id: (cartItem.productVariant.id).toString(),
                    quantity: cartItem.quantity
                }
            ))
          })
          .catch((error) => console.log(error))
        
        return cartProducts
    }
 
    // Function gets the client secret from server to build the checkout session
    async function fetchClientSecret(){
        const cartProducts = await getCartProducts()
        
        // TODO: Change url to server url
        return fetch("http://localhost:3306/stripe/create-checkout-session", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: cartProducts,
            userId: userId,
            guestUserId: guestUserId
          }),
        })
          .then((res) => res.json())
          .then((data) => data.clientSecret);
    }   

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