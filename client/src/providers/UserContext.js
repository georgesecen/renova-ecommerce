import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Use named import for jwt-decode

// Create UserContext
const UserContext = createContext();

// Provide the context to the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check cookies on initial load
    useEffect(() => {
        const token = Cookies.get('jwt'); // Retrieve the JWT token from cookies
        if (token) {
            try{
                const decoded = jwtDecode(token); // Decode the token
                setUser({ userId: decoded.userId });
                setIsLoggedIn(true);
            } catch(err) {
                console.error("Invalid token:", err);
                Cookies.remove('jwt'); // Remove invalid token
            }

        }
    }, []);

    // Update user on login
    const login = (token) => {
        try {
            Cookies.set('jwt', token); // Set JWT token in cookies
            const decoded = jwtDecode(token); // Decode the token
            setIsLoggedIn(true)
            setUser({ userId: decoded.userId }); // Update React Context state
        } catch(err) {
            console.error("failed to decode token:", err);
        }

    };

    const logout = () => {
        Cookies.remove('jwt'); // Clear JWT token from cookies
        setIsLoggedIn(false);
        setUser(null); // Remove user data from context
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to access user context
export const useUser = () => useContext(UserContext);
