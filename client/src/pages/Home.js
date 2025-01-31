import React from 'react'
import '../styles/homePage.css'
import '../assets/images/hoodie2.png'

function Home() {
  const hoodieImg = require('../assets/images/hoodie2.png')

  return (
    <div className="home-page">
        <div className="section a">
          <div className="text">
            <h1>BRAND</h1>
            <p>Brand info cool modern streetwear comfy</p>
          </div>
          <div className="image">
            <img src={hoodieImg} />
          </div>
        </div>

        <div className="section b">

        </div>
    </div>
  )
}

export default Home