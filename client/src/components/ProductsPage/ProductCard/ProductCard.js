import './productCard.css';

function ProductCard(props) {
    // const img = require('../../assets/images/hoodie2.png')

    const imgUrl = props.image[0] ? `/images/${props.image[0].image_url}` : ''

    return (
        <div className='product-card'>
            <div className='card' onClick={props.customClickEvent}>
                <div className="image">
                    <img src={imgUrl} alt=""/>
                    {/* <img src={img} alt=""/> */}
                </div>
                <div className="name">{props.name}</div>
                <div className="price">{props.price}</div>
            </div>
            
            <div className='colours'>
                {props.cols && Array.from(props.cols).map((col ,i) => {
                    if (i > 5) {    // Ensures maximum 6 colours render
                        return null
                    }
                    return (
                    <div key={i} className="colour-option">
                        <div style={{background: col}}></div>
                    </div>
                    )
                })}
            </div>
        </div>

    )
}

export default ProductCard;