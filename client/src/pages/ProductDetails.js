import '../styles/productDetails.css'

function ProductDetails() {
    return (
      <div className="detailsPage">
        <div className="detailsImg">
          image
        </div>
        <div className="details">
            <h4>Product Name</h4>
            <h6>$29.99</h6>
            <p>sjfdj skd fsk dfskkjah</p>
            <form>
                <h5>Colour</h5>
                <h5>Size</h5>
                <button type="submit">Add to cart</button>
            </form>
        </div>
      </div>
    );
  }
  
  export default ProductDetails