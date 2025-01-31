import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../styles/bottomNavBar.css'

function BottomNavBar() {
  return (
    <div className="bottomNav">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>Products</NavLink>
        <NavLink to='/contact'>Contact</NavLink>
    </div>
  );
}

export default BottomNavBar