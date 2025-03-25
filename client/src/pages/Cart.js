import React, {useState} from 'react';
import '../styles/cartPage.css';
import CartList from '../components/CartList';
import {useCart} from '../providers/CartContext';
import {Link, NavLink} from "react-router-dom";

function Cart() {
    const { totalQuantity } = useCart();
    const [totalCost, setTotalCost] = useState(0);
  return (
    <div className="cart-page">
        <h1>CART</h1>
          <div className="cartCheckoutContainer">
              {totalQuantity === 0 ? (
                  <p>
                      No items to display. <br/>
                      <Link to={"/products"}>Click here</Link> to add items to your cart!
                  </p>
              ) : (
                  <div className="cartCheckoutButton">
                      <CartList setTotalCost={setTotalCost} />
                      <h3>Total Cost Before HST and Shipping: CAD ${totalCost.toFixed(2)}</h3>
                      <NavLink to='/checkout' className="shop-now">Checkout</NavLink>
                  </div>
              )}
          </div>
    </div>
  )
}

export default Cart