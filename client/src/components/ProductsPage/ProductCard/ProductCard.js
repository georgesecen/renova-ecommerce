import './productCard.css';

function ProductCard(props) {

    // If it has an image, get its url
    const imgUrl = props.image[0] ? `http://localhost:3306/static/images/${props.image[0].image_url}` : ''

    // Colour map
    let colourMap = new Map([
        ['black', 'rgb(75, 75, 75)'],
        ['grey', 'rgb(166, 166, 166)'],
        ['white', 'rgb(247, 254, 255)'],
        ['beige', 'rgb(228, 192, 162)'],
        ['brown', 'rgb(141, 100, 87)'],
        ['red', 'rgb(246, 86, 86)'],
        ['orange', 'rgb(238, 157, 51)'],
        ['green', 'rgb(164, 216, 114)'],
        ['yellow', 'rgb(245, 240, 100)'],
        ['blue', 'rgb(154, 218, 229)'],
        ['purple', 'rgb(205, 148, 237)'],
        ['pink', 'rgb(239, 152, 207)'],
    ]);

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
                        <div style={{background: colourMap.get(col)}}></div>
                    </div>
                    )
                })}
            </div>
        </div>

    )
}

export default ProductCard;