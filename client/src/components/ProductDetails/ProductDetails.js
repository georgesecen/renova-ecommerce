import './productDetails.css'
import './sizeOption.css';
import './colourOption.css';
import Carousel from 'react-bootstrap/Carousel';
import { redirect, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getProductInfo } from '../../services/products';
import ImageOption from './ImageOption/ImageOption';
import { addProduct } from "../../services/cart";
import { useCart } from "../../providers/CartContext";
import { useUser } from "../../providers/UserContext";
import ProductModal from '../ProductModal';
import { useNavigate } from 'react-router-dom';

function ProductDetails() {
  const navigate = useNavigate();  

  const params = useParams();
  const productId = params.id;

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL'];
  const [variants, setVariants] = useState([]);
  const [colour, setColour] = useState("")
  const [size, setSize] = useState("")
  const [productImages, setProductImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [stockQty, setStockQty] = useState(0);
  const [selectedVariant, setSeletedVariant] = useState(0);

  const cols = useRef(new Set()); 
  const sizes = useRef(new Set()); 
  const sizesAvailable = useRef(new Set());   // Holds sizes available for currently selected colour
  const info = useRef({name: "", price: "", desc: "", gender: ""});

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const { updateCartQuantity } = useCart();
  const { user, isLoggedIn } = useUser();

  const user_id = user;
  const guest_user_id = localStorage.getItem("guestUserId");

  // Colour map
  let colourMap = new Map([
    ['black', 'rgb(26, 26, 26)'],
    ['grey', 'rgb(123, 123, 123)'],
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

  /**
   * This function handles a color change. It will:
   * 
   * 1) Clear the current sizes available and populate it 
   *    with the sizes available for the new color
   * 
   * 2) Set the images to the product images along with any images
   *    associated with the new color
   * 
   * 3) Sets the color state
   * 
   * 4) Set the size state to the first size available or null
   *    if none exist
   * 
   * @param {String} col colour to set as selected
   */
  function selectColour(col) {
    sizesAvailable.current.clear()
    setImages(productImages)

    for(const v of variants){
      if(v.color === col){
        sizesAvailable.current.add(v.size)
        setImages(productImages.concat(v.images))
      }
    }

    // Set states
    setColour(col)
    sizesAvailable.current.size > 0 ? setSize([...sizesAvailable.current][0]) : setSize(null);
    const variant = variants.filter(product => product.color == col && product.size == [...sizesAvailable.current][0])[0]
    setSeletedVariant(variant)
    setStockQty(variant.stock_quantity);
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

    const variant = variants.filter(product => product.color == colour && product.size == s)[0]
    setSeletedVariant(variant)
    setStockQty(variant.stock_quantity);
  }


  /**
   * This method on page load fetches the product information of the viewed product,
   * stores all variants associated with it, stores all sizes and colours available,
   * all images, and sets initial selected colour and size.
   */
    useEffect(() => {
          getProductInfo(productId)
            .then((response) => {
              // console.log(response.data.data[0]);
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
              setProductImages(response.data.data[0].image)
              setImages(response.data.data[0].image.concat(response.data.data[0].product_variants[0].images))

              // set initial variant, colour, size, and sizesAvailable
              setSeletedVariant(response.data.data[0].product_variants[0])
              setStockQty(response.data.data[0].product_variants[0].stock_quantity)
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
              navigate('/page-not-found');
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

    /**
     * This function adds a product variant to the cart by finding the id
     * of the variant that with attributes that match the selected ones
     */
    const addToCartHandler = () => {
        const productData = {
            user_id,
            guest_user_id,
            product_variant_id: selectedVariant.id,
            quantity: 1,
        };
        addProduct(productData)
            .then(() => {
                // Update the cart quantity both in context and localStorage
                let currentQuantity;
                if(isLoggedIn) {
                    currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                } else {
                    //TODO change to userCartQuantity later
                    currentQuantity = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;
                }
                const newQuantity = currentQuantity + productData.quantity;
                updateCartQuantity(newQuantity);  // Update context

            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
            
        // Show success message
        setModalContent({
            title: "Product Added to Cart",
            message: `${info.current.name} has been successfully added to your cart.`,
            // image: `/images/${product.image[0].image_url}`,
        });
        setShowModal(true)
    };

    return (
      <div className="detailsPage">
        <div className="productImages">
          {images.map((image, index) => (
              <ImageOption 
                key={index} 
                imageUrl={`http://localhost:3306/static/images/${image.image_url}`} 
                clickEvent={() => setSelectedImage(index)}
              />
            ))}
        </div>

        <div className="selectedImg">
          <Carousel activeIndex={selectedImage} onSelect={handleSelect} interval={null}>
            {images.map((image, index) => (
              <Carousel.Item key={index}> 
                <img 
                  src={`http://localhost:3306/static/images/${image.image_url}`}
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
                  <div style={{background: colourMap.get(col)}}></div>
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

            { stockQty > 0 ? (
            <button className="addToCart" onClick={() => addToCartHandler()}>ADD TO CART</button>
              ) : (
              <p className='outOfStock'>OUT OF STOCK</p>
            )}

            <h5>PRODUCT DESCRIPTION</h5>
            <p>{info.current.desc}</p>

        </div>
        <ProductModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={modalContent.title}
                message={modalContent.message}
                // image={modalContent.image}
            />
      </div>
    );
  }
  
  export default ProductDetails