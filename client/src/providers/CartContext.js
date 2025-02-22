import React, { createContext, useState, useEffect, useContext } from 'react';
import {getCartItemQuantity, getCartItems} from '../services/api';

// Create Context for Cart
const CartContext = createContext();

// Custom hook to use Cart context
export const useCart = () => useContext(CartContext);

// CartProvider to wrap the app with context
export const CartProvider = ({ children }) => {
    const [totalQuantity, setTotalQuantity] = useState(0);

    // Fetch cart items on mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const quantity = await getCartItemQuantity();
                setTotalQuantity(quantity);  // Set the cart quantity from the API
                localStorage.setItem('cartQuantity', quantity);  // Persist cart quantity
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        // Try loading from localStorage if available
        const storedQuantity = localStorage.getItem('cartQuantity');
        if (storedQuantity) {
            setTotalQuantity(parseInt(storedQuantity, 10));
        } else {
            fetchCartItems(); // Fetch from API if not in localStorage
        }
    }, []);

    // Function to update cart quantity (e.g., add/remove items)
    const updateCartQuantity = (newQuantity) => {
        setTotalQuantity(newQuantity);
        localStorage.setItem('cartQuantity', newQuantity);  // Update localStorage
    };

    return (
        <CartContext.Provider value={{ totalQuantity, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
