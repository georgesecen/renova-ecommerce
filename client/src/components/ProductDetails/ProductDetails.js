import './productDetails.css'
import './sizeOption.css';
import './colourOption.css';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../assets/images/hoodie.png'
import img2 from '../../assets/images/hoodie2.png'
import { useLocation } from 'react-router-dom';
import { getVariants } from '../../services/productVariants';
import { useState, useEffect } from 'react';

function ProductDetails() {

  const {state} = useLocation();
  const { id, name, price } = state;

  const [variants, setVariants] = useState([]);
  const [colour, setColour] = useState(0)
  const [size, setSize] = useState(0)

  /**
   * This method fetches all variants associated with the viewed product.
   */
  useEffect(() => {
          console.log(variants);
          getVariants(state.id)
              .then((response) => {
                  console.log(response);

                  setVariants(response.data);  // Store items in state
                  console.log(variants)
              })
              .catch((error) => {
                  console.error('Error fetching variants:', error);
              });
      }, []);

  
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

            <h5>COLOUR - WHITE</h5>
            <div className='colour-container'>
              <div className={colour === 0 ? "colour-option active" : "colour-option"} onClick={() => setColour(0)}>
                <div></div>
              </div>
              <div className={colour === 1 ? "colour-option active" : "colour-option"} onClick={() => setColour(1)}>
                <div></div>
              </div>
            </div>

            <h5>SIZE</h5>
            <div className='size-container'>
              <div className={size === 0 ? "size-option active" : "size-option"} onClick={() => setSize(0)}>
                  <div>S</div>
              </div>
              <div className={size === 1 ? "size-option active" : "size-option"} onClick={() => setSize(1)}>
                  <div>M</div>
              </div>
            </div>

            <button className="addToCart">ADD TO CART</button>
        </div>
      </div>
    );
  }
  
  export default ProductDetails