import React, {useState} from 'react';
import './cartPage.css';
import CartItem from './CartItem/CartItem';
import { getCartItems } from '../../services/cart';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function CartPage() {
    let navigate = useNavigate(); 

    const [totalCost, setTotalCost] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            console.log(cartItems);
            // Fetch cart items when the component mounts
            getCartItems()
                .then((response) => {
                    // console.log(response[0].item.productVariant.product.image.img_url);
                    // console.log(response);
                    const formattedItems = response.map((item) => ({
                        cart_item_id: item.id,
                        quantity: item.quantity,
                        product_id: item.productVariant.product.id,
                        product_name: item.productVariant.product.name,
                        product_price: parseFloat(item.productVariant.product.price),
                        product_size: item.productVariant.size,
                        product_color: item.productVariant.color,
                        product_image: item.productVariant.product.image[0].image_url,
                        total: parseFloat(item.productVariant.product.price) / item.quantity
                    }));
                    setCartItems(formattedItems);  // Store items in state
                    console.log(cartItems)
    
                    // Set a delay so the spinner stays visible for at least 1 second
                    setTimeout(() => {
                        setLoading(false);
                    }, 200);  // Adjust this value to make the spinner visible longer
                })
                .catch((error) => {
                    console.error('Error fetching cart:', error);
                    setLoading(false); // Stop loading if there's an error
                });
        }, []);
        
        useEffect(() => {
                // Calculate total cost whenever cartItems change and update the parent state
                const total = cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
                setTotalCost(total);
            }, [cartItems, setTotalCost]);

    return (
        <div className="cart-page">
            <div className='cart-section'>
                <h1>CART</h1>
                <div className='cart'>
                    {cartItems.map((item, i) => (
                        <CartItem key={i}
                        item={item}
                        img={item.product_image}
                        name={item.product_name}
                        color={item.product_color}
                        size={item.product_size}
                        price={item.product_price}
                        qty={item.quantity}
                        setItems={setCartItems}
                        />
                    ))}
                </div>
            </div>
            <div className='summary-section'>
                <h1>ORDER SUMMARY</h1>
                <div className='summary'>
                    <div><p>SUBTOTAL:</p> <p>${totalCost.toFixed(2)}</p></div>
                    <div><p>SHIPPING:</p> <p>$0.0</p></div>
                    <div><p>TOTAL:</p> <p>${(totalCost + 0).toFixed(2)}</p></div>
                    <button className='button' onClick={() => navigate('/test-stripe')}>CHECKOUT</button>
                </div>
            </div>
            
        </div>
    )
}

export default CartPage