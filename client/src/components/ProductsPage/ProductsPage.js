import { useState, useEffect } from 'react';
import './productsPage.css'
import ProductCard from '../ProductCard/ProductCard';
import { getProducts } from '../../services/products';
import { useNavigate } from 'react-router-dom';
import { addProduct } from "../../services/cart";
import { useCart } from "../../providers/CartContext";
import { useUser } from "../../providers/UserContext";


function ProductsPage() {
    const navigate = useNavigate();  
    const [filter, filterBy] = useState(0);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [value, setValue] = useState(1);
    const { updateCartQuantity } = useCart();
    const { user, isLoggedIn } = useUser();

    const user_id = user;
    const guest_user_id = localStorage.getItem("guestUserId");


    useEffect(() => {
        console.log(products)
        getProducts()
            .then((response) => {
                console.log(response.data[0].image[0]);
                console.log(response.data[0].image[0].image_url);
                setProducts(response.data);
                setFilteredProducts(response.data)  // Populate filtering array
                setTimeout(() => setLoading(false), 100);  // Show spinner for 200ms
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);
    //Function to add to cart - pass it through props
    const addToCartHandler = (product) => {
        const productData = {
            user_id,
            guest_user_id,
            product_variant_id: product.id,
            quantity: value,
        };
        console.log(productData);
        addProduct(productData)
            .then(() => {
                // Update the cart quantity both in context and localStorage
                let currentQuantity;
                if(isLoggedIn) {
                    currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                } else {
                    //TODO change to userCartQuantity later
                    currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                }
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

    // Temporary filtering method
    const filterProducts = (id) => {
        filterBy(id)

        let name = ""
        switch (id) {
            case 0:
                setFilteredProducts(products)
                return
            case 1:
                name = "Hoodie"
                break
            case 2:
                name = "shirt"
                break
            case 3:
                name = "Joggers"
        }

        setFilteredProducts(products.filter(product => product.name == name));
        console.log(filter, filteredProducts)
        // return result
    }

    /** This function will take in an int productId and 
     *  redirect the user to /products:id where id is 
     *  productId
     * 
     * @param {*} product 
     */
    // const toProductPage = (productId) => {
    //     navigate('/products/' + (productId), {state: { id: productId } })
    // }

    // Temporary method to pass in product details
    const toProductPage = (product) => {
        navigate('/products/' + (product.id), {state: { id: product.id, name: product.name, price: product.price, desc: product.desc } })
    }

    return (
        <div className="products-page">
            <div className="content">

                <div className="side-nav">
                    <ul>
                    <li className={filter === 0 ? "active" : ""} onClick={() => filterProducts(0)}>ALL</li>
                    <li className={filter === 1 ? "active" : ""} onClick={() => filterProducts(1)}>HOODIES</li>
                    <li className={filter === 2 ? "active" : ""} onClick={() => filterProducts(2)}>T-SHIRTS</li>
                    <li className={filter === 3 ? "active" : ""} onClick={() => filterProducts(3)}>PANTS</li>
                    </ul>
                </div>

                <div className="products-list">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} customClickEvent={() => toProductPage(product)}

                    // img={`images/${product.image[0].image_url}`} 
                    name={product.name} 
                    price={product.price}
                    // image={product.image[0].image_url}
                    image={`/images/${product.image[0].image_url}`}
                                 // product_image: item.productVariant.product.image[0].image_url
                    addToCart={() => addToCartHandler(product)}>
                        
                    </ProductCard>
                ))}
                </div>

            </div>
        </div>
    );
}

export default ProductsPage;