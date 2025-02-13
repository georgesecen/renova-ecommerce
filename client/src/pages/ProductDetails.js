import '../styles/productDetails.css'
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../assets/images/hoodie.png'
import img2 from '../assets/images/hoodie2.png'
import { useLocation } from 'react-router-dom';

function ProductDetails() {

  const {state} = useLocation();
  const { id, name, price, desc } = state;
    return (
      <div className="detailsPage">
        <div className="productImages">
          
        </div>
        <div className="selectedImg">
          <Carousel activeIndex={1}>
            <Carousel.Item className="carouselItem">
              <img src={img1} alt=""/>
            </Carousel.Item>
            <Carousel.Item>
            <img src={img2} alt=""/>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="details">
            <h4>{state.name}</h4>
            <h6>${state.price}</h6>
            <p>{state.desc}</p>
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