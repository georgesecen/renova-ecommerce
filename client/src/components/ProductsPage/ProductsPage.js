import { useState, useEffect } from 'react';
import './productsPage.css'
import ProductCard from '../ProductCard/ProductCard';
import { getProducts } from '../../services/api';

function ProductsPage() {
    const [filter, filterBy] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="products-page">
            <div className="side-nav">
                <ul>
                <li className={filter === 0 ? "active" : ""} onClick={() => filterBy(0)}>ALL</li>
                <li className={filter === 1 ? "active" : ""} onClick={() => filterBy(1)}>HOODIES</li>
                <li className={filter === 2 ? "active" : ""} onClick={() => filterBy(2)}>T-SHIRTS</li>
                <li className={filter === 3 ? "active" : ""} onClick={() => filterBy(3)}>PANTS</li>
                </ul>
            </div>

            <div className="products-list">
            {products.map((product) => (
                <ProductCard key={product.id} name={product.name} price={product.price}/>
            ))}
            </div>
        </div>
    );
}

export default ProductsPage;