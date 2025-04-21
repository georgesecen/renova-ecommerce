import { NavLink } from "react-router-dom";

import "./bottomNavBar.css";

function BottomNavBar() {
  return (
    <div className="bottomNav">
      <NavLink to="/">HOME</NavLink>
      <NavLink to="/products">CLOTHING</NavLink>
      <NavLink to="/contact">CONTACT</NavLink>
      <NavLink to="/signIn">SIGN IN</NavLink>
    </div>
  );
}

export default BottomNavBar;
