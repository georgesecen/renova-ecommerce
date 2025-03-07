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

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL'];
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
  function selectColour(col) {
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

  /**
   * Sets size given only if it is available
   * for the selected colour
   * 
   * @param {*} s size
   */
  function selectSize(s){
    if(sizesAvailable.current.has(s)){
      setSize(s)
    }
  }

  /**
   * This method on page load fetches all variants associated with the
   * viewed product, gets all sizes and colours available for viewed product, 
   * and sets initial selected colour and size
   */
    useEffect(() => {
          getVariants(state.id)
              .then((response) => {
                  console.log(response);

                  setVariants(response);  // Store items in state
                  cols.current = new Set(response.map(a => a.color))
                  sizes.current = new Set(response.map(a => a.size).sort(function(a,b) { // Sort sizes in appropriate order
                    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
                  }));

                  setColour(response[0].color)

                  for(const v of response){
                    if(v.color === response[0].color){
                      sizesAvailable.current.add(v.size)
                    }
                  }
                  setSize(response[0].size)
              })
              .catch((error) => {
                  console.error('Error fetching variants:', error);
              });
    }, []);

    /**
     * This function takes in a string size and returns the class names
     * to be associated with it. By default, all available sizes for
     * a product have a className 'size-option'
     * 
     * If a size is currently selected, it should have an additional
     * className of 'active'
     * 
     * If a size is unavailable for the currently selected colour,
     * it should have an additional className of 'unavailable'
     * 
     * @param {*} s size
     * @returns string containing all appropriate class names
     */
    function getSizeClasses(s){
      let classes = "size-option"
      if (size === s) { classes += " active" }
      else if (sizesAvailable.current.has(s) == false) {classes += " unavailable"}

      return classes
    }
  
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
                <div key={col} className={colour === col ? "colour-option active" : "colour-option"} onClick={() => selectColour(col)}>
                  <div style={{background: col}}></div>
                </div>
              ))}
            </div>

            <h5>SIZE</h5>
            <div className='size-container'>

              {Array.from(sizes.current).map((s) => (
                <div key={s} className={getSizeClasses(s)} onClick={() => selectSize(s)}>
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