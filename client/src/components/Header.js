import { NavLink } from 'react-router-dom'
import {useCart} from "../providers/CartContext";
import '../styles/header.css'
import { CgShoppingCart } from 'react-icons/cg'
import '../assets/images/logo.png'
import {useUser} from "../providers/UserContext";

function Header() {
  const { totalQuantity } = useCart();
  const { isLoggedIn, logout } = useUser();
  const logo = require('../assets/images/logo.png');
    console.log(isLoggedIn)
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
                    <NavLink to="/" onClick={logout}>LOGOUT</NavLink>
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