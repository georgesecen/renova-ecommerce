import React from 'react'
import '../styles/homePage.css'
import '../assets/images/hoodie2.png'
import '../assets/images/hoodie.png'
import { NavLink } from 'react-router-dom'


function Home() {
  const hoodieImg = require('../assets/images/hoodie.png')
  const hoodieImg2 = require('../assets/images/hoodie2.png')

  return (
    <div className="home-page">
        <div className="section a">
          <div className="text">
            <h1>RENOVA</h1>
            <p>Brand info cool modern streetwear comfy</p>
            <NavLink to='/products' className="shop-now">SHOP NOW</NavLink>
          </div>
          <div className="image">
            <img src={hoodieImg2} alt=""/>
            <img src={hoodieImg} alt=""/>
          </div>
        </div>

        <div className="section b">

        </div>
    </div>
  )
}

export default Home