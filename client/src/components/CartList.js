import '../styles/cartPage.css'
import React, { useEffect, useState } from "react";
import {getCartItems, removeCartItem} from "../services/api";
import Spinner from "./Spinner";
import {useCart} from "../providers/CartContext";
import ProductModal from "./ProductModal";

function CartList() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const { updateCartQuantity } = useCart();

    useEffect(() => {
        console.log(cartItems);
        // Fetch cart items when the component mounts
        getCartItems()
            .then((response) => {
                // console.log(response[0].item.productVariant.product.image.img_url);
                console.log(response);
                const formattedItems = response.map((item) => ({
                    cart_item_id: item.id,
                    quantity: item.quantity,
                    product_id: item.productVariant.product.id,
                    product_name: item.productVariant.product.name,
                    product_price: parseFloat(item.productVariant.product.price),
                    product_description: item.productVariant.product.description,
                    product_image: item.productVariant.product.image[0].image_url
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

    const removeFromCartHandler = (item) => {
        console.log(`removing item ${item}`);
        setShowModal(true);
        setModalContent({
            title: `Removed ${item.product_name}`,
            message: `Removed ${item.product_name} from cart`,
        });

        // If the quantity is greater than 1, decrease the quantity
        if (item.quantity > 1) {
            const updatedQuantity = item.quantity - 1;
            console.log(item)
            console.log(item.quantity)
            console.log(item.cart_item_id)
            console.log(item.product_id)
            // console.log(item.productVariant.id)
            console.log(item.quantity)

            // Call the API to update the quantity
            removeCartItem({
                cart_item_id: item.cart_item_id,
                // product_id: item.cart_item_id,
                product_id: item.productVariant?.id || item.product_id,
                quantity: 1, // Decrease by 1
            })
                .then(() => {
                    // Update the cart locally
                    setCartItems((prevItems) =>
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
                // product_id: item.product_id,
                quantity: 1, // Indicate that we're removing one
            })
                .then(() => {
                    // Remove the item from the cart locally
                    setCartItems((prevItems) =>
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
    };
    // Logic for spinner
    if (loading) {
        return (
            //TODO put styles in external stylesheet
            <div className="product-list" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spinner />
            </div>
            // <div><Spinner /></div>
        );
    }
    // Function to calculate total cost of items in the cart
    const calculateTotalCost = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product_price * item.quantity);
        }, 0);
    };

    // Get the total cost
    const totalCost = calculateTotalCost();

    return (
        <div>
        <ul className="productList">
            {cartItems.map((item) => {
                return (
                    <li key={item.cart_item_id} className="productItem">
                        <img src={`/images/${item.product_image}`} alt={item.product_name} />
                        <div className="productName">
                            <h3>{item.product_name}</h3>
                        </div>
                        <div className="productPrice">
                            CAD ${item.product_price}
                            <p>{item.product_description}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                        <button className="add-to-cart-btn" onClick={() => removeFromCartHandler(item)}>
                            Remove From Cart
                        </button>
                    </li>
                );
            })}
        </ul>
            <div className="total-cost">
                <h3>Total Cost Before HST and Shipping: CAD ${totalCost.toFixed(2)}</h3>
            </div>
            <ProductModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={modalContent.title}
                message={modalContent.message}
                image={modalContent.image}
            />
        </div>
    );
}

export default CartList;
