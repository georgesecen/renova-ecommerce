import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';
import {CartProvider} from "./providers/CartContext";  // Ensure this path is correct (you might want to adjust it based on your file structure)
import {UserProvider} from "./providers/UserContext";
// Create the root using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root
root.render(
    <React.StrictMode>
        <UserProvider>
        <CartProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CartProvider>
        </UserProvider>
    </React.StrictMode>
);