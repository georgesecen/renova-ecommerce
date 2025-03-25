import React from 'react'
import { NavLink } from "react-router-dom";
import "./home.css"

const Home = ({logout}) => {
  return (
    <div>
      <NavLink to="/" onClick={logout}>LOGOUT</NavLink>
    </div>
  )
}

export default Home