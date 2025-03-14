import React from 'react';
import '../styles/cartPage.css';
import CartList from '../components/CartList';
import {useCart} from '../providers/CartContext';
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const { totalQuantity } = useCart();
    const navigate = useNavigate();
    const clickHandler = () => {navigate('/test-stripe')}
  //TODO only display checkout button when there are items in the cart
  return (
    <div className="cart-page">
        <h1>Your Orders</h1>
    <div>
        <div>
          <div>
              {totalQuantity === 0 && <p>No items to display. <br/>
                  <Link to="/products">Click here</Link> to add items to your cart!</p>}
              <CartList/>
              <button onClick={clickHandler}>Checkout</button>
          </div>
        </div>
    </div>
    </div>
  )
}

export default Cart