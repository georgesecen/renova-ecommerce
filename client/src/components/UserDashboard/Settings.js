import { NavLink } from 'react-router-dom'
import '../../components/UserDashboard/UserDashboard.css'
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
            await logoutUser(); // Call API to log out

            // Ensure JWT is removed before updating state
            localStorage.removeItem('jwt');
            localStorage.removeItem('cartQuantity');
            localStorage.removeItem('guestUserId');

            logout(); // Update context AFTER clearing storage
            updateCartQuantity(0);

            // Force a hard reload to clear any cached state
            navigate('/', { replace: true });
            window.location.reload(); // Ensures state resets
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="section">
            <h1>Account Settings</h1>
            <p>Update your personal details and preferences.</p>
            <div className="headerNavSettings">
                    <NavLink to="/" onClick={logoutHandler}>LOGOUT</NavLink>
            </div>
        </div>
    );
};

export default Settings;
