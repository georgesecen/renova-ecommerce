import { NavLink } from 'react-router-dom'
import '../styles/header.css'
import { CgShoppingCart } from 'react-icons/cg'
import '../assets/images/logo.png'
import { useUser } from "../providers/UserContext";
import { useCart } from "../providers/CartContext";

function Header() {
    const { totalQuantity } = useCart();
    const { isLoggedIn } = useUser();
    const logo = require('../assets/images/logo.png');
    console.log(isLoggedIn);

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
                        <NavLink to="/dashboard">PROFILE</NavLink>
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