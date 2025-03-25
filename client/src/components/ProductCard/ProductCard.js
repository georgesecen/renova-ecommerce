import './productCard.css';

function ProductCard(props) {
    const img = require('../../assets/images/hoodie2.png')
    return (
        <div className='product-card'>
            <div className='card' onClick={props.customClickEvent}>
                <div className="image">
                    {/* <img src={props.image} alt={props.image}/> */}
                    <img src={img} alt=""/>
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