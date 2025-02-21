import './productCard.css';

function ProductCard() {
    const img = require('../../assets/images/hoodie2.png')
    return (
        <div className='product-card'>
            <div className="image">
                <img src={img} alt=""/>
            </div>
            <div className="name">NAME</div>
            <div className="price">10.99</div>
        </div>
    )
}

export default ProductCard;