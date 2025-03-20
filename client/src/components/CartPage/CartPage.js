import React, {useState} from 'react';
import './cartPage.css';
import {useCart} from '../../providers/CartContext';
import {Link, NavLink} from "react-router-dom";
import CartItem from './CartItem/CartItem';

function CartPage() {
    const { totalQuantity } = useCart();
    const [totalCost, setTotalCost] = useState(0);

    return (
        <div className="cart-page">
            <div className='cart-section'>
                <h1>CART</h1>
                <div className='cart'>
                    <CartItem/>
                    <CartItem/>
                    <CartItem/>
                </div>
                
            </div>
            <div className='summary-section'>
                <h1>ORDER SUMMARY</h1>
                <div className='summary'>
                </div>
            </div>
            
        </div>
    )
}

export default CartPage