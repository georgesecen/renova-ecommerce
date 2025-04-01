import './cartItem.css'
import {FaTrash} from "react-icons/fa";
import { useState } from 'react';
import { useCart } from '../../../providers/CartContext';
import {removeCartItem, updateCartItemQuantity} from "../../../services/cart";
import ProductModal from "../../ProductModal";
import {useUser} from "../../../providers/UserContext";

function CartItem(props) {
    const imgUrl = props.img ? `http://localhost:3306/static/images/${props.img}` : '';

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const { updateCartQuantity } = useCart();
    const { isLoggedIn } = useUser();

    console.log("user logged in", isLoggedIn);

    const updateQuantityHandler = (item, newQuantity) => {
        if (newQuantity < 1) return;

        updateCartItemQuantity(item.cart_item_id, newQuantity)
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

                setShowModal(true);
                setModalContent({
                    title: `Removed ${item.product_name}`,
                    message: `Removed ${item.product_name} from cart`,
                });
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
            <button onClick={() => updateQuantityHandler(props.item, props.qty - 1)}>-</button>
                {props.qty}
            <button onClick={() => updateQuantityHandler(props.item, props.qty + 1)}>+</button>

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