import './productDetails.css'
import './sizeOption.css';
import './colourOption.css';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../assets/images/hoodie.png'
import img2 from '../../assets/images/hoodie2.png'
import { useLocation } from 'react-router-dom';
import { getVariants } from '../../services/productVariants';
import { useState, useEffect, useRef } from 'react';

function ProductDetails() {

  const {state} = useLocation();
  const { id, name, price } = state;

  const [variants, setVariants] = useState([]);
  const [colour, setColour] = useState("")
  const [size, setSize] = useState("")

  const cols = useRef(new Set()); 
  const sizes = useRef(new Set()); 

  /**
   * This method fetches all variants associated with the viewed product.
   */
    useEffect(() => {
          getVariants(state.id)
              .then((response) => {
                  console.log(response);

                  setVariants(response);  // Store items in state
                  cols.current = new Set(response.map(a => a.color))
                  sizes.current = new Set(response.map(a => a.size))

                  setColour(response[0].color)
                  setSize(response[0].size)

                  console.log("Variants: ", variants)
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

            <h5>COLOUR - {colour}</h5>
            <div className='colour-container'>

              {Array.from(cols.current).map((col) => (
                <div key={col} className={colour === col ? "colour-option active" : "colour-option"} onClick={() => setColour(col)}>
                  <div></div>
                </div>
              ))}
            </div>

            <h5>SIZE</h5>
            <div className='size-container'>

              {Array.from(sizes.current).map((s) => (
                <div key={s} className={size === s ? "size-option active" : "size-option"} onClick={() => setSize(s)}>
                  <div>{s}</div>
                </div>
              ))}
            </div>

            <button className="addToCart">ADD TO CART</button>
        </div>
      </div>
    );
  }
  
  export default ProductDetails