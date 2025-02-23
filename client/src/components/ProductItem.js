import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/products';
import { addProduct } from '../services/cart';
import { useCart } from '../providers/CartContext';
import Spinner from '../components/Spinner';
import '../styles/productsPage.css';
import ProductModal from "./ProductModal";
import { Button } from "../components/Button";
import {useUser} from "../providers/UserContext";

function ProductItem() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const { updateCartQuantity } = useCart();  // Get the update function from context
    const { user } = useUser();
    console.log('userID: ', user);

    const [value, setValue] = useState(1);
    //used to increment and decrement the quantity value
    const increment = () => setValue(prev => Math.min(prev + 1, 9));
    const decrement = () => setValue(prev => Math.max(prev - 1, 1));
    const validateInput = (e) => {
        let newValue = e.target.value.replace(/[^0-9]/g, "");
        newValue = newValue === "" ? 1 : Math.min(Math.max(parseInt(newValue), 1), 9);
        setValue(newValue);
    };
    const user_id = user;

    useEffect(() => {
        console.log(products)
        getProducts()
            .then((response) => {
                console.log(response.data[0].image[0]);
                setProducts(response.data);
                setTimeout(() => setLoading(false), 100);  // Show spinner for 200ms
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    const addToCartHandler = (product) => {
        const productData = {
            //TODO grab from another way than from local storage??? for now store user_id in local storage on login/sign up
            user_id: user_id,
            product_variant_id: product.id,
            quantity: value,
        };
        console.log(productData);
        addProduct(productData)
            .then(() => {
                // Update the cart quantity both in context and localStorage
                let currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                const newQuantity = currentQuantity + productData.quantity;
                updateCartQuantity(newQuantity);  // Update context
                // localStorage.setItem('cartQuantity', newQuantity);  // Persist in localStorage
                //Set content for modal
                console.log(product.image[0].image_url);
                setModalContent({
                    title: "Product Added to Cart",
                    message: `${product.name} has been successfully added to your cart.`,
                    image: `/images/${product.image[0].image_url}`,
                });
                setShowModal(true)
            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
    };

    if (loading) {
        //TODO put styles in external stylesheet
        return (
            // <div className="product-list" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh",backgroundColor:"red" }}>
            //     <Spinner />
            // </div>
            <div className='spinner-container'>
                <Spinner/>
            </div>
        );
    }
    return (
        <div>
        <ul className="productList">
            {products.map((product) => (
                <li key={product.id} className="productItem">
                    {/*if product contains more than one image grab the first - otherwise grab default*/}
                    <img
                        // src={product.images?.length > 0 ? `/images/${product.images[0].image_url}` : '/images/default.jpg'}
                        src={`images/${product.image[0].image_url}`}
                        alt={product.product_name}
                    />
                    <div className="productName">
                        <h3>{product.name}</h3>
                    </div>
                    <div className="productPrice">
                        CAD ${product.price}
                        <p>{product.description}</p>
                    </div>
                    {/* <button className="add-to-cart-btn" onClick={() => addToCartHandler(product)}>
                        Add to Cart
                    </button> */}


                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid #333",
                        borderRadius: "8px",
                        width: "120px",
                        overflow: "hidden"
                    }}>
                        <button onClick={decrement} style={{
                            background: "#333",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer"
                        }}>-
                        </button>
                        <input
                            type="text"
                            min="0"
                            max="9"
                            value={value}
                            onChange={validateInput}
                            style={{width: "50px", textAlign: "center", border: "none", outline: "none"}}
                        />
                        <button onClick={increment} style={{
                            background: "#333",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer"
                        }}>+
                        </button>
                    </div>
                    <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
                </li>
            ))}
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

export default ProductItem;