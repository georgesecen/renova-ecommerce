import './cartItem.css'
import {FaTrash} from "react-icons/fa";
import { useState } from 'react';
import { useCart } from '../../../providers/CartContext';
import {removeCartItem, updateCartItemQuantity} from "../../../services/cart";
import {useUser} from "../../../providers/UserContext";

// Default image which will be used for cart items with no product image available
const defaultImage = require("../../../assets/images/default-cart-image.png")

function CartItem(props) {

    // If cart item has no image display default image in its place
    const imgUrl = props.img ? `http://localhost:3306/static/images/${props.img}` : defaultImage;

    const { updateCartQuantity } = useCart();
    const { isLoggedIn } = useUser();

    // Keep track if the cart item quantity is currently being updated. This way if the user spams the
    // increment/decrement button there will be no concurrency problems.
    const [quantityUpdating, setQuantityUpdating] = useState(false)

    console.log("user logged in", isLoggedIn);

    const updateQuantityHandler = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        // If the quantity is currently being updated
        if (quantityUpdating) return
   
        // Otherwise the quantity is now being updated
        setQuantityUpdating(true)

        await updateCartItemQuantity(item.cart_item_id, newQuantity)
            .then(() => {
                props.setItems((prevItems) =>
                    prevItems.map((prevItem) =>
                        prevItem.cart_item_id === item.cart_item_id
                            ? { ...prevItem, quantity: newQuantity }
                            : prevItem
                    )
                );

                let currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                const difference = newQuantity - item.quantity;
                const updatedQuantity = currentQuantity + difference;

                updateCartQuantity(updatedQuantity); // Update context
                localStorage.setItem('cartQuantity', updatedQuantity); // Persist in localStorage
            })
            .catch((error) => {
                console.error('Error updating cart item quantity:', error);
            })
            .finally(() => {
                // The quantity is done updating
                setQuantityUpdating(false)
            });
    };

    const removeFromCartHandler = (item) => {
        removeCartItem({ cart_item_id: item.cart_item_id, quantity: 1 })
            .then(() => {
                props.setItems((prevItems) =>
                    prevItems.filter((prevItem) => prevItem.cart_item_id !== item.cart_item_id)
                );

                let currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                const newQuantity = Math.max(currentQuantity - item.quantity, 0); // Ensure it doesn't go negative

                updateCartQuantity(newQuantity);
                localStorage.setItem('cartQuantity', newQuantity);
            })
            .catch((error) => {
                console.error('Error removing cart item:', error);
            });
    };

    return (
        <div className="cart-item">
            <div className='image'>
                <img src={imgUrl} />
            </div>
            <div className='desc'>
                <h3>{props.name}</h3>
                <p>{props.size}</p>
                <p>{props.color}</p>
            </div>
            <div className='price'>${props.price}</div>

            <div className='qty'>
                <button onClick={() => updateQuantityHandler(props.item, props.qty - 1)}>-</button>
                    {props.qty}
                <button onClick={() => updateQuantityHandler(props.item, props.qty + 1)}>+</button>
            </div>

            <FaTrash className="removeBtn" type={"submit"} onClick={() => removeFromCartHandler(props.item)}/>
        </div>
    )
}

export default CartItem