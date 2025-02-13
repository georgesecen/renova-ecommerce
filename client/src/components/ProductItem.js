import React, { useState, useEffect } from 'react';
import { getProducts, addProduct } from '../services/api';
import { useCart } from '../providers/CartContext';
import Spinner from '../components/Spinner';
import '../styles/productsPage.css';
import ProductModal from "./ProductModal";
import { Button } from "../components/Button";
import { useNavigate } from 'react-router-dom';

function ProductItem() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const { updateCartQuantity } = useCart();  // Get the update function from context

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
            //TODO change user_id to something more dynamic
            user_id: 2,  // Simulating logged-in user ID
            product_variant_id: product.id,
            quantity: 1,
        };
        console.log(productData);
        addProduct(productData)
            .then(() => {
                // Update the cart quantity both in context and localStorage
                let currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                const newQuantity = currentQuantity + 1;
                updateCartQuantity(newQuantity);  // Update context
                localStorage.setItem('cartQuantity', newQuantity);  // Persist in localStorage
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

    /** This function will take in a product object and 
     *  redirect the user to /products:id where id is 
     *  product.id and send the data of the product object
     *  to the page
     * 
     * @param {*} product 
     */
    const toProductPage = (product) => {
        navigate('/products/' + (product.id), {
                 state: { id: product.id, name: product.name, 
                        price: product.price, desc: product.description } 
                    }
                )
    }

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
                <li key={product.id} className="productItem" onClick={() => toProductPage(product)}>
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