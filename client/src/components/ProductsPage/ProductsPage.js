import { useState, useEffect, useRef } from 'react';
import './productsPage.css'
import ProductCard from '../ProductCard/ProductCard';
import { getProducts } from '../../services/products';
import { useNavigate } from 'react-router-dom';
import { getVariants } from '../../services/productVariants';
import { getAllCategories } from '../../services/productCategories';
import { addProduct } from "../../services/cart";
import { useCart } from "../../providers/CartContext";
import { useUser } from "../../providers/UserContext";
import ProductModal from "../ProductModal";


function ProductsPage() {
    const navigate = useNavigate();  
    const categories = useRef([]);
    const [genderFilter, filterByGender] = useState('all');
    const [categoryFilter, filterByCategory] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const cols = useRef(new Map());

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

                // // Map all colour variants
                // for (const p in response.data){
                //     getVariants(p)
                //     .then((res) => {
                //         let colSet = new Set(res.map(a => a.color))
                //         cols.current.set(p, colSet);
                //     })
                // }

                setTimeout(() => setLoading(false), 100);  // Show spinner for 200ms
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });

        // Request to retrieve all categories and store result
        getAllCategories()
            .then((res) => {
                categories.current = res.data.data
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
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
                //Set content for modal
                console.log(product.image[0].image_url);

            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
        setModalContent({
            title: "Product Added to Cart",
            message: `${product.name} has been successfully added to your cart.`,
            image: `/images/${product.image[0].image_url}`,
        });
        setShowModal(true)
        console.log("Modal state:", showModal);
    };


    /** This function will take in an int productId and 
     *  redirect the user to /products:id where id is 
     *  productId
     * 
     * @param {*} product 
     */

    // Temporary method to pass in product details
    const toProductPage = (product) => {
        navigate('/products/' + (product.id), {state: { id: product.id, name: product.name, price: product.price, desc: product.desc } })
    }

    return (
        <div className="products-page">
            <div className="content">

                <div className="side-nav">
                    <p>GENDER</p>
                    <ul>
                    <li className={genderFilter === 'all' ? "active" : ""} onClick={() => filterByGender('all')}>ALL</li>
                    <li className={genderFilter === 'men' ? "active" : ""} onClick={() => filterByGender('men')}>MEN</li>
                    <li className={genderFilter === 'women' ? "active" : ""} onClick={() => filterByGender('women')}>WOMEN</li>
                    <li className={genderFilter === 'unisex' ? "active" : ""} onClick={() => filterByGender('unisex')}>UNISEX</li>
                    </ul>
                    <p>CATEGORY</p>
                    <ul>
                    <li className={categoryFilter === 0 ? "active" : ""} onClick={() => filterByCategory(0)}>ALL</li>
                    {categories.current.map((category, index) => (
                        <li key={index} className={categoryFilter === category.id ? "active" : ""} onClick={() => {filterByCategory(category.id)}}>{category.name.toUpperCase()}</li>
                    ))}
                    </ul>
                </div>

                <div className="products-list">
                {products.map((product) => {
                    if (categoryFilter !== product.categoryId && categoryFilter !== 0){
                        return null
                    }
                    if (genderFilter !== product.gender && genderFilter !== 'all'){
                        return null
                    }
                    return (
                        <ProductCard key={product.id} customClickEvent={() => toProductPage(product)}
                            name={product.name} 
                            price={product.price}
                            cols={cols.current.get(String(product.id))}
                            // image={`/images/${product.image[0].image_url}`}
                            addToCart={() => addToCartHandler(product)}>
                        </ProductCard>
                    )
                    })}
                </div>
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

export default ProductsPage;