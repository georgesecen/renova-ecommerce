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
  // const { id, name, price } = state;

  const [variants, setVariants] = useState([]);
  const [colour, setColour] = useState("")
  const [size, setSize] = useState("")

  const cols = useRef(new Set()); 
  const sizes = useRef(new Set()); 

  const sizesAvailable = useRef(new Set());   // Holds sizes available for currently selected colour

  /**
   * This function takes a string and sets it as the colour state,
   * then populates the sizesAvailable set to any sizes associated with
   * the colour, and lastly current size to first in sizesAvailable or
   * null if empty
   * 
   * @param {*} col colour to set as selected
   */
  function changeColour(col) {
    sizesAvailable.current.clear()
    for(const v of variants){
      if(v.color === col){
        sizesAvailable.current.add(v.size)
      }
    }
    // Set states
    setColour(col)
    sizesAvailable.current.size > 0 ? setSize([...sizesAvailable.current][0]) : setSize(null);
  }

  function selectSize(s){
    if(sizesAvailable.current.has(s)){
      setSize(s)
    }
  }
  console.log(sizesAvailable.current)
  console.log(size)


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

                  // console.log("Variants: ", variants)
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

            <h5>COLOUR: {colour.toUpperCase()}</h5>
            <div className='colour-container'>

              {Array.from(cols.current).map((col) => (
                <div key={col} className={colour === col ? "colour-option active" : "colour-option"} onClick={() => changeColour(col)}>
                  <div style={{background: col}}></div>
                </div>
              ))}
            </div>

            <h5>SIZE</h5>
            <div className='size-container'>

              {Array.from(sizes.current).map((s) => (
                <div key={s} className={size === s ? "size-option active" : "size-option"} onClick={() => selectSize(s)}>
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