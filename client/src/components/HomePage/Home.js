import React, { useEffect } from 'react';
import './homePage.css';
import './section2.css';
import '../../assets/images/hoodie2.png';
import '../../assets/images/hoodies.png';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createGuestUser } from "../../services/guest";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const hoodiesImg = require('../../assets/images/hoodies.png');
  const hoodieImg2 = require('../../assets/images/hoodie2.png');

  // Generate guest session function
  const generateGuestSession = () => {
    const session = uuidv4();
    // Expiry set to 24 hours (converted to seconds)
    const expiry = Math.floor(Date.now() / 1000) + 86400;
    return { session, expiry };
  };

  // Function to create guest session
  const createGuestSession = async () => {
    let sessionToken = localStorage.getItem('sessionToken');
    let guestUserId = localStorage.getItem('guestUserId');

    // If there's no session or guest user ID, create a new session
    if (!sessionToken || !guestUserId) {
      const sessionData = generateGuestSession();
      sessionToken = sessionData.session;
      const sessionExpiry = sessionData.expiry.toString();

      // Store session and expiry in local storage
      localStorage.setItem('sessionToken', sessionToken);
      localStorage.setItem('sessionExpiry', sessionExpiry);

      try {
        // Attempt to create a guest user
        const response = await createGuestUser(sessionToken, sessionExpiry);
        console.log(response.data);

        if (response.data.guestUserId) {
          // If the guest user ID is returned, store it
          localStorage.setItem('guestUserId', response.data.guestUserId);
        } else {
          console.error('Guest user ID was not returned.');
        }
      } catch (error) {
        console.error('Error creating guest session:', error);
      }
    } else {
      console.log(`Guest session already exists, token: ${sessionToken}, userID: ${guestUserId}`);
    }
  };

  useEffect(() => {
    // Check if the component is mounted and the location state exists
    if (location.state?.forceRender) {
      console.log('Force render triggered');
    }
    createGuestSession();
  }, [location.state]); // Dependency array can depend on location.state for more specific re-renders

  return (
      <div className="home-page">
        <div className="section a">
          <div className="text">
            <h1>RENOVA</h1>
            <p>Brand info cool modern streetwear comfy</p>
            <NavLink to='/products' className="shop-now">SHOP NOW</NavLink>
          </div>
          <div className="image">
            <img src={hoodiesImg} alt="Hoodies" />
          </div>
        </div>
      </div>
  );
}

export default Home;
