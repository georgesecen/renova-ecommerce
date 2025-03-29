import React from 'react'
import { NavLink } from "react-router-dom";
import "./home.css"

/**
 * Welcomes the user to the user dashboard and gives them the option to logout of their account.
 * @param {function} logout Function which logs the customer out of their account.
 * @returns {React.JSX.Element} Home user dashboard section React component.
 */
const Home = ({ logout }) => {
  return (
    <div className='user-dash-home'>
      <h1>Welcome User 👋</h1>
      <p>Explore the latest in streetwear and manage your account.</p>
      <NavLink to="/" onClick={logout}>LOGOUT</NavLink>
    </div>
  )
}

export default Home