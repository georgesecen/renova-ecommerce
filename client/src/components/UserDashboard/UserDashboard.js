import React, { useState } from "react";
import Home from "./Home/Home";
import {logoutUser} from "../../services/user";
import { useUser } from "../../providers/UserContext";
import { useCart } from "../../providers/CartContext";
import {NavLink, useNavigate} from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("home");
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
            localStorage.removeItem('guestUserId')

            navigate('/', { state: { forceRender: true } });
        } catch (error) {
            console.error("logoutUser");
            throw error;
        }
    }

    return (
        <div className="dashboard">
            {/*<Sidebar setActiveSection={setActiveSection} />*/}
            <div className="content">
                {/*{activeSection === "home" && <Home />}*/}
                {/*{activeSection === "orders" && <Orders />}*/}
                {/*{activeSection === "wishlist" && <Wishlist />}*/}
                {/*{activeSection === "settings" && <Settings />}*/}
                <div className="section">
                    <h1>Welcome </h1>
                    <p>Update your personal details and preferences.</p>
                    <div className="headerNavSettings">
                        <NavLink to="/" onClick={logoutHandler}>LOGOUT</NavLink>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default UserDashboard;
