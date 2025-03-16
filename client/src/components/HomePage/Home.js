import React, {useEffect} from 'react'
import './homePage.css'
import './section2.css'
import '../../assets/images/hoodie2.png'
import '../../assets/images/hoodies.png'
import { NavLink } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { createGuestUser } from "../../services/guest";

function Home() {
  const hoodiesImg = require('../../assets/images/hoodies.png')
  const hoodieImg2 = require('../../assets/images/hoodie2.png')

//generate session function
  function generateGuestSession() {
    const session = uuidv4()
    //expiry set to 24 hours converted to seconds
    const expiry = Math.floor(Date.now() / 1000) + 86400;
    return {session, expiry}
  }

useEffect(() => {
  const handleWindowLoad = async () => {

    // grab expiry and sessionToken
    let sessionToken = localStorage.getItem('sessionToken');
    let guestUserId = localStorage.getItem('guestUserId');
    // check to see if there is a guest session
    if(!sessionToken || !guestUserId) {
      const sessionData = generateGuestSession();
      sessionToken = sessionData.session;
      let sessionExpiry = sessionData.expiry.toString();

      localStorage.setItem('sessionToken', sessionToken);
      localStorage.setItem('sessionExpiry', sessionExpiry)
      // create new user in the database
      try {
        const response = await createGuestUser(sessionToken, sessionExpiry);
        console.log(response.data)
        if(response.data.guestUserId) {
          localStorage.setItem('guestUserId', response.data.guestUserId)
        }
      } catch (error) {
        console.error('Error creating guest session:', error);
      }
    } else {
      console.log(`Guest session already exists, token: ${sessionToken}, userID: ${guestUserId}`)
    }
  };
//add event listener to the window on load
  window.addEventListener('load', handleWindowLoad);
//clean up function to remove it
  return () => {
    window.removeEventListener('load', handleWindowLoad);
  };
}, []);

  return (
    <div className="home-page">
        <div className="section a">
          <div className="text">
            <h1>RENOVA</h1>
            <p>Brand info cool modern streetwear comfy</p>
            <NavLink to='/products' className="shop-now">SHOP NOW</NavLink>
          </div>
          <div className="image">
            <img src={hoodiesImg} alt=""/>
          </div>
        </div>

        <div className="section b">
          <img src={hoodieImg2} alt=""/>
          <h2>MODERN</h2>
          <p>Cool amazing carefully designed </p>
        </div>
    </div>
  )
}

export default Home