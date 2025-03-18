import { useState, useEffect, useRef } from 'react';
import './productsPage.css'
import ProductCard from '../ProductCard/ProductCard';
import { getProducts } from '../../services/products';
import { useNavigate } from 'react-router-dom';
import { getVariants } from '../../services/productVariants';


function ProductsPage() {
    const navigate = useNavigate();  
    const [genderFilter, filterByGender] = useState(0);
    const [categoryFilter, filterByCategory] = useState(0);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const cols = useRef(new Map());

    useEffect(() => {
        console.log(products)
        getProducts()
            .then((response) => {
                //console.log(response.data[0].image[0]);
                setProducts(response.data);
                setFilteredProducts(response.data)  // Populate filtering array

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
    }, []);

    // Temporary filtering method
    const filterProducts = (id) => {
        filterByCategory(id)

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
                    <li className={genderFilter === 0 ? "active" : ""} onClick={() => filterByGender(0)}>ALL</li>
                    <li className={genderFilter === 1 ? "active" : ""} onClick={() => filterByGender(1)}>MEN</li>
                    <li className={genderFilter === 2 ? "active" : ""} onClick={() => filterByGender(2)}>WOMEN</li>
                    <li className={genderFilter === 3 ? "active" : ""} onClick={() => filterByGender(3)}>UNISEX</li>
                    </ul>

                    <ul>
                    <li className={categoryFilter === 0 ? "active" : ""} onClick={() => filterProducts(0)}>ALL</li>
                    <li className={categoryFilter === 1 ? "active" : ""} onClick={() => filterProducts(1)}>HOODIES</li>
                    <li className={categoryFilter === 2 ? "active" : ""} onClick={() => filterProducts(2)}>T-SHIRTS</li>
                    <li className={categoryFilter === 3 ? "active" : ""} onClick={() => filterProducts(3)}>PANTS</li>
                    </ul>
                </div>

                <div className="products-list">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} customClickEvent={() => toProductPage(product)}

                    // img={`images/${product.image[0].image_url}`} 
                    name={product.name} 
                    price={product.price}
                    cols={cols.current.get(String(product.id))}>

                    </ProductCard>
                ))}
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;