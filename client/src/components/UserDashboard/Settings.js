import { NavLink } from 'react-router-dom'
import '../../components/UserDashboard/UserDashboard.css'
import { CgShoppingCart } from 'react-icons/cg'
import { useUser } from "../../providers/UserContext";
import { useCart } from "../../providers/CartContext";
import { logoutUser } from "../../services/user";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const { totalQuantity, updateCartQuantity } = useCart();
    const {isLoggedIn, logout, } = useUser();
    const navigate = useNavigate();

    //Handle logout
    const logoutHandler = async () => {
        try {
            await logoutUser();
            logout();
            updateCartQuantity(0);
            localStorage.removeItem('cartQuantity');
            navigate('/');
        } catch (error) {
            console.error("logoutUser");
            throw error;
        }
    }
    return (
        <div className="section">
            <h1>Account Settings</h1>
            <p>Update your personal details and preferences.</p>
            <div className="headerNav2">
                    <NavLink to="/" onClick={logoutHandler}>LOGOUT</NavLink>
            </div>
        </div>
    );
};

export default Settings;
