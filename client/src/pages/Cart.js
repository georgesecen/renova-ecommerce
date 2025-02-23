import React from 'react';
import classes from '../styles/cartPage.css';
import CartList from '../components/CartList';
import {useCart} from '../providers/CartContext';
import {Link} from "react-router";

function Cart() {
    const { totalQuantity } = useCart();
  return (
    <div className="cart-page">
        <h1>Your Orders</h1>
    <div className={classes.cart}>
        <div>
          <div>
              {totalQuantity === 0 && <p>No items to display. <br/>
                  <Link to="/products">Click here</Link> to add items to your cart!</p>}
              <CartList/>
          </div>
        </div> 
    </div>
    </div>
  )
}

export default Cart