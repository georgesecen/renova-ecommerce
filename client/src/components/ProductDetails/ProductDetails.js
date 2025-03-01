import './productDetails.css'
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../assets/images/hoodie.png'
import img2 from '../../assets/images/hoodie2.png'
import { useLocation } from 'react-router-dom';
import { getVariants } from '../../services/productVariants';
import { useState, useEffect } from 'react';
import ColourOption from './ColourOption';
import SizeOption from './SizeOption';

function ProductDetails() {

  const {state} = useLocation();
  const { id, name, price } = state;

  const [variants, setVariants] = useState([]);


  useEffect(() => {
          console.log(variants);
          // Fetch cart items when the component mounts
          getVariants(state.id)
              .then((response) => {
                  console.log(response);

                  setVariants(response.data);  // Store items in state
                  console.log(variants)
              })
              .catch((error) => {
                  console.error('Error fetching cart:', error);
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

            <h5>COLOUR</h5>
            <div className='colour-container'>
              <ColourOption/>
              <ColourOption/>
              <ColourOption/>
            </div>

            <h5>SIZE</h5>
            <div className='size-container'>
              <SizeOption/>
              <SizeOption/>
              <SizeOption/>
            </div>

            <button className="addToCart">ADD TO CART</button>
        </div>
      </div>
    );
  }
  
  export default ProductDetails