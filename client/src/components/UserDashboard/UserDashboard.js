import React, { useState, useEffect } from "react";
import Home from "./Home/Home";
import Orders from "./Orders/Orders";
import { logoutUser } from "../../services/user";
import { useUser } from "../../providers/UserContext";
import { useCart } from "../../providers/CartContext";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../../services/orders";
import { FaHome, FaShoppingBag } from "react-icons/fa";
import "./UserDashboard.css";

/**
 * User dashboard so customer can manage account and view order history.
 * @returns {React.JSX.Element} UserDashboard React component.
 */
const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("home");
    const { totalQuantity, updateCartQuantity } = useCart();
    const { isLoggedIn, logout, user } = useUser();
    const [orders, setOrders] = useState([])      
    const navigate = useNavigate();

    // Get user orders
    useEffect(() => {
        if (user !== null){
            getUserOrders(user.userId)
            .then((response) => setOrders(response.data.data))
            .catch((error) => console.log(error))
        }
    }, [user])

    //Handle logout
    const logoutHandler = async () => {
        try {
            await logoutUser();
            logout();
            updateCartQuantity(0);
            localStorage.removeItem('cartQuantity');
            localStorage.removeItem('guestUserId')

            navigate('/', { state: { forceRender: true } });
        } catch (error) {
            console.error("logoutUser");
            throw error;
        }
    }

    return (
        <div className="user-dash-container">

            {/* Navbar */}
            <div className="user-dash-nav">
                <div 
                    className={`${activeSection === "home" ? "selected" : ""}`} 
                    onClick={() => setActiveSection("home")}>
                    <FaHome /> Home
                </div>

                <div 
                    className={`${activeSection === "orders" ? "selected" : ""}`} 
                    onClick={() => setActiveSection("orders")}>
                    <FaShoppingBag /> Orders
                </div>
            </div>

            {/* Only display section if user has it currently selected from navbar */}
            {activeSection === "home" && <Home logout={logoutHandler} />}
            {activeSection === "orders" && <Orders orders={orders}/>}
        </div>
    );
};

export default UserDashboard;
