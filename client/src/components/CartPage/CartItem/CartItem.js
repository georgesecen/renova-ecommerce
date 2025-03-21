import './cartItem.css'
import {FaTrash} from "react-icons/fa";
import { useState } from 'react';
import { useCart } from '../../../providers/CartContext';
import {getCartItems, removeCartItem} from "../../../services/cart";
import ProductModal from "../../ProductModal";

function CartItem(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const { updateCartQuantity } = useCart();

    const removeFromCartHandler = (item) => {
            console.log(`removing item ${item}`);
    
            // If the quantity is greater than 1, decrease the quantity
            if (item.quantity > 1) {
                const updatedQuantity = item.quantity - 1;
    
                // Call the API to update the quantity
                removeCartItem({
                    cart_item_id: item.cart_item_id,
                    product_id: item.productVariant?.id || item.product_id,
                    quantity: 1, // Decrease by 1
                })
                    .then(() => {
                        // Update the cart locally
                        props.setItems((prevItems) =>
                            prevItems.map((prevItem) =>
                                prevItem.cart_item_id === item.cart_item_id
                                    ? { ...prevItem, quantity: updatedQuantity }
                                    : prevItem
                            )
                        );
                        // Update the cart quantity both in context and localStorage
                        let currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                        const newQuantity = currentQuantity - 1;
                        updateCartQuantity(newQuantity); // Update context
                        localStorage.setItem('cartQuantity', newQuantity); // Persist in localStorage
                    })
                    .catch((error) => {
                        console.error('Error updating cart item quantity:', error);
                    });
            } else {
                // If the quantity is 1, delete the item
                removeCartItem({
                    cart_item_id: item.cart_item_id,
                    quantity: 1, // Indicate that we're removing one
                })
                    .then(() => {
                        // Remove the item from the cart locally
                        props.setItems((prevItems) =>
                            prevItems.filter((prevItem) => prevItem.cart_item_id !== item.cart_item_id)
                        );
    
                        // Update the cart quantity both in context and localStorage
                        let currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                        const newQuantity = currentQuantity - 1;
                        updateCartQuantity(newQuantity); // Update context
                        localStorage.setItem('cartQuantity', newQuantity); // Persist in localStorage
                    })
                    .catch((error) => {
                        console.error('Error removing cart item:', error);
                    });
            }
            setShowModal(true);
            setModalContent({
                title: `Removed ${item.product_name}`,
                message: `Removed ${item.product_name} from cart`,
            });
        };

    return (
        <div className="cart-item">
            <div className='image'>
                <img src={`/images/${props.img}`} alt={`${props.name}_img`}/>
            </div>
            <div className='desc'>
                <h3>{props.name}</h3>
                <p>{props.size}</p>
                <p>{props.color}</p>
            </div>
            <div className='price'>${props.price}</div>
            <div className='quantity'>- {props.qty} +</div>
            <FaTrash className="removeBtn" type={"submit"} onClick={() => removeFromCartHandler(props.item)}/>
            <ProductModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={modalContent.title}
                message={modalContent.message}
                image={modalContent.image}
            />
        </div>
    )
}

export default CartItem