import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Settings from "./Settings";
import "./UserDashboard.css";

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("home");

    return (
        <div className="dashboard">
            <Sidebar setActiveSection={setActiveSection} />
            <div className="content">
                {activeSection === "home" && <Home />}
                {activeSection === "orders" && <Orders />}
                {activeSection === "wishlist" && <Wishlist />}
                {activeSection === "settings" && <Settings />}
            </div>
        </div>
    );
};

export default UserDashboard;
