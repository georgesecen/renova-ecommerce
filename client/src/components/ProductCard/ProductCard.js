import './productCard.css';

function ProductCard(props) {
    const img = require('../../assets/images/hoodie2.png')
    return (
        <div className='product-card' onClick={props.customClickEvent}>
            <div className='card'>
                <div className="image">
                    <img src={img} alt=""/>
                    {/* <img src={props.img} alt=""/> */}
                </div>
                <div className="name">{props.name}</div>
                <div className="price">{props.price}</div>
            </div>
            <button>ADD TO CART</button>
        </div>

    )
}

export default ProductCard;