import './cartItem.css'

function CartItem() {

    return (
        <div className="cart-item">
            <div className='image'></div>
            <div className='desc'>
                <h3>NAME</h3>
                <p>SIZE:</p>
                <p>COLOUR:</p>
            </div>
            <div className='price'>$20.00</div>
            <div className='quantity'>+ 1 -</div>
        </div>
    )
}

export default CartItem