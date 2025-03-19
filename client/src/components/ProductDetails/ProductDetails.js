import './productDetails.css'
import './sizeOption.css';
import './colourOption.css';
import Carousel from 'react-bootstrap/Carousel';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getProductInfo } from '../../services/products';
import ImageOption from './ImageOption/ImageOption';

function ProductDetails() {

  const {state} = useLocation();

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL'];
  const [variants, setVariants] = useState([]);
  const [colour, setColour] = useState("")
  const [size, setSize] = useState("")
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  const cols = useRef(new Set()); 
  const sizes = useRef(new Set()); 
  const sizesAvailable = useRef(new Set());   // Holds sizes available for currently selected colour
  const info = useRef({name: "", price: "", desc: "", gender: ""});

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
   * This method on page load fetches the product information of the viewed product,
   * stores all variants associated with it, stores all sizes and colours available,
   * all images, and sets initial selected colour and size.
   */
    useEffect(() => {
          getProductInfo(state.id)
            .then((response) => {
              console.log(response.data.data[0]);
              // store info, variants, colours, sizes (in defined order), and images
              info.current.name = response.data.data[0].name
              info.current.price = response.data.data[0].price
              info.current.desc = response.data.data[0].description
              info.current.gender = response.data.data[0].gender

              setVariants(response.data.data[0].product_variants);
              cols.current = new Set(response.data.data[0].product_variants.map(a => a.color))
              sizes.current = new Set(response.data.data[0].product_variants.map(a => a.size).sort(function(a,b) { // Sort sizes in appropriate order
                return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
              }));
              setImages(response.data.data[0].image)
              setImages(images.concat(response.data.data[0].product_variants[0].images))

              // set initial colour, size, and sizesAvailable
              setColour(response.data.data[0].product_variants[0].color)

              for(const v of response.data.data[0].product_variants){
                if(v.color === response.data.data[0].product_variants[0].color){
                  sizesAvailable.current.add(v.size)
                }
              }
              
              setSize(response.data.data[0].product_variants[0].size)
            })
            .catch((error) => {
              console.error('Error fetching product:', error);
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

    /**
     * Function to handle image selection when a carousel
     * button is clicked
     * 
     * @param {Int} selectedIndex 
     */
    const handleSelect = (selectedIndex) => {
      setSelectedImage(selectedIndex);
    };

    return (
      <div className="detailsPage">
        <div className="productImages">
          {images.map((image, index) => (
              <ImageOption 
                key={index} 
                imageUrl={require(`../../assets/images/${image.image_url}`)} 
                clickEvent={() => setSelectedImage(index)}
              />
            ))}
        </div>

        <div className="selectedImg">
          <Carousel activeIndex={selectedImage} onSelect={handleSelect} interval={null}>
            {images.map((image, index) => (
              <Carousel.Item key={index}> 
                <img 
                  src={require(`../../assets/images/${image.image_url}`)}
                  alt="" 
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="details">
            <h4>{info.current.name}</h4>
            <h6>${info.current.price}</h6>

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
            <h5>PRODUCT DESCRIPTION</h5>
            {/* <p>GENDER: {info.current.gender.toUpperCase()}</p> */}
            <p>{info.current.desc}</p>

        </div>
      </div>
    );
  }
  
  export default ProductDetails