import React from 'react';
// import { useSelector } from 'react-redux'
import classes from '../styles/cartPage.css';
import CartList from '../components/CartList';

function Cart() {
  // const cartIsEmpty = useSelector(state => state.cart.cartIsEmpty)
  return (
    <div className="cart-page">
        <h1>Your Orders</h1>
    <div className={classes.cart}>
        <div>
          <div>
            {/*{cartIsEmpty && <p>No Items to display</p>}*/}
            {/*{console.log(cartIsEmpty)}*/}
            {/*{!cartIsEmpty && <CartList />}*/}
              <CartList/>
          </div>
        </div> 
    </div>
    </div>
  )
}

export default Cart