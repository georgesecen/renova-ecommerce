import { useState } from 'react';
import './productsPage.css'
import ProductCard from '../ProductCard/ProductCard';

function ProductsPage() {
    const [filter, filterBy] = useState(0)
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
                <ProductCard/>
            </div>
        </div>
    );
}

export default ProductsPage;