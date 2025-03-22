import '../styles/cartPage.css'
import React, { useEffect, useState } from "react";
import {getCartItems, removeCartItem} from "../services/cart";
import Spinner from "./Spinner";
import {useCart} from "../providers/CartContext";
import ProductModal from "./ProductModal";
import {Button} from "./Button";
import {FaTrash} from "react-icons/fa";

function CartList({ setTotalCost }) {
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
        setShowModal(true);
        setModalContent({
            title: `Removed ${item.product_name}`,
            message: `Removed ${item.product_name} from cart`,
        });
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
                console.log(item)
                return (
                    <li key={item.cart_item_id} className="productItem">
                        <img src={`http://localhost:3306/static/images/${item.product_image}`} alt={item.product_name}/>
                        <div className="productName">
                            <h3>{item.product_name}</h3>
                        </div>
                        <div className="productPrice">
                            <p className="subtitleText">Price</p>
                            CAD ${item.product_price}
                        </div>
                        <div className="productQuantity">
                            <p className="subtitleText">Quantity</p>

                            <div className="priceSelect">
                                <select value={item.quantity}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </div>

                        </div>
                        <div className="productTotal">
                            <p className="subtitleText">Total</p>
                            <p>{`$${item.product_price * item.quantity}`}</p>
                        </div>
                        <FaTrash className="removeBtn" type={"submit"} onClick={() => removeFromCartHandler(item)}/>
                    </li>
                );
            })}
        </ul>
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
