import './productCard.css';

function ProductCard(props) {
    const img = require('../../assets/images/hoodie2.png')
    return (
        <div className='product-card'>
            <div className='card' onClick={props.customClickEvent}>
                <div className="image">
                    <img src={props.image} alt={props.image}/>
                    {/*<img src={img} alt=""/>*/}
                    {/* <img src={props.img} alt=""/> */}
                </div>
                <div className="name">{props.name}</div>
                <div className="price">{props.price}</div>
            </div>
            <button onClick={props.addToCart}>ADD TO CART</button>
        </div>

    )
}

export default ProductCard;