import { NavLink } from 'react-router-dom'

import '../styles/header.css'
import { CgShoppingCart } from 'react-icons/cg'
import '../assets/images/logo.png'
import { useUser } from "../providers/UserContext";
import { useCart } from "../providers/CartContext";
import { logoutUser } from "../services/api";

function Header() {
  const { totalQuantity, updateCartQuantity } = useCart();
  const { isLoggedIn, logout } = useUser();
  const logo = require('../assets/images/logo.png');
    console.log("user logged in: ",isLoggedIn)
    const logoutHandler = async () => {
        try {
            await logoutUser();
            logout();
            updateCartQuantity(0);
            localStorage.removeItem('cartQuantity');
            window.location.href = '/';
        } catch (error) {
            console.error("logoutUser");
            throw error;
        }
        console.log("user logged in: ",isLoggedIn)
    }
  return (
    <div className="header">
      <div className="headerContent">
        <div className="headerLogo">
          <img src={logo} alt="" />
          RENOVA
        </div>
            <div className="headerNav">
                <NavLink to='/'>HOME</NavLink>
                <NavLink to='/products'>PRODUCTS</NavLink>
                <NavLink to='/contact'>CONTACT</NavLink>
            </div>
            <div className="headerNav2">
                {isLoggedIn ? (
                    <NavLink to="/" onClick={logoutHandler}>LOGOUT</NavLink>
                ) : (
                    <NavLink to="/signIn">SIGN IN</NavLink>
                )}
                <NavLink to='/cart'> {totalQuantity} {<CgShoppingCart />}</NavLink>
            </div>
        </div>
    </div>
  );
}

export default Header