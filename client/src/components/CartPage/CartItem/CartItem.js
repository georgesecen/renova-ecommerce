import './cartItem.css'

function CartItem(props) {

    return (
        <div className="cart-item">
            <div className='image'>
                <img src={`/images/${props.img}`} alt={`${props.name}_img`}/>
            </div>
            <div className='desc'>
                <h3>{props.name}</h3>
                <p>{props.size}</p>
                <p>{props.color}</p>
            </div>
            <div className='price'>${props.price}</div>
            <div className='quantity'>+ 1 -</div>
        </div>
    )
}

export default CartItem