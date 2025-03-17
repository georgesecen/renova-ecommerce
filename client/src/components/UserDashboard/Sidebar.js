import React from "react";
import { FaHome, FaShoppingBag, FaHeart, FaUser } from "react-icons/fa";

const Sidebar = ({ setActiveSection }) => {
    return (
        <div className="sidebar">
            <h2>RENOVA</h2>
            <ul>
                <li onClick={() => setActiveSection("home")}><FaHome /> Home</li>
                <li onClick={() => setActiveSection("orders")}><FaShoppingBag /> Orders</li>
                <li onClick={() => setActiveSection("wishlist")}><FaHeart /> Wishlist</li>
                <li onClick={() => setActiveSection("settings")}><FaUser /> Settings</li>
            </ul>
        </div>
    );
};

export default Sidebar;