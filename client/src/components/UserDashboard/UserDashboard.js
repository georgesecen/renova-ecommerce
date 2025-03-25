import React, { useState } from "react";
import Home from "./Home/Home";
import Orders from "./Orders/Orders";
import {logoutUser} from "../../services/user";
import { useUser } from "../../providers/UserContext";
import { useCart } from "../../providers/CartContext";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("home");
    const { totalQuantity, updateCartQuantity } = useCart();
    const { isLoggedIn, logout, user } = useUser();
    const navigate = useNavigate();

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
        <div>

            <div>
                <div onClick={() => setActiveSection("home")}>Home</div>
                <div onClick={() => setActiveSection("orders")}>Orders</div>
            </div>

            {activeSection === "home" && <Home logout={logoutHandler} />}
            {activeSection === "orders" && <Orders userId={user.userId}/>}
        </div>
    );
};

export default UserDashboard;
