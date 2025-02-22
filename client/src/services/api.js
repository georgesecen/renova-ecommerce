import axios from "axios";

// set up url to match express
const API = axios.create({
    baseURL: 'http://localhost:3306',
    withCredentials: true,
});

export const getProducts = () => {
    return API.get("/products", {withCredentials: true});
}
export const addProduct = (product) => {
    return API.post("/cart", product, {withCredentials: true});
}
export const removeCartItem = (cartItem) => {
    console.log(`Attempting to delete /cart/${cartItem.cart_item_id}`);
    return API.delete(`/cart/${cartItem.cart_item_id}`, {
        withCredentials: true,
        data: {
            product_id: cartItem.cart_item_id,
            quantity: cartItem.quantity,
        },
    });
};
//Register user
export const addUser = (uuid,username,email,password) => {
    console.log("Attempting to register a new user");
    return API.post(`/user/register`, {uuid,username,email,password}, {withCredentials: true});
}
//User login
export const loginUser = async (email,password) => {
    try {
        const response = await API.post(`/user/login`, {email,password}, {withCredentials: true});
        return response;
    } catch(error) {
        console.error("login error: ", error);
        throw error;
    }
}
//Create guest user
export const createGuestUser = async (session_token,expiry) => {
    console.log("Attempting to register a new guest user");
    return API.post(`/guest/register`, {session_token, expiry}, {withCredentials: true});
}

export const getGuestUser = async () => {
    const guestUserId = localStorage.getItem('guestUserId');  // Retrieve guestUserId
    if (!guestUserId) {
        console.warn("No guest user ID found in localStorage.");
        return null;
    }

    try {
        const response = await API.get(`/guest/${guestUserId}`, {withCredentials:true});  // Fetch guest user by ID
        return response.data;
    } catch (error) {
        console.error('Error fetching guest user:', error);
        return null;
    }
};


export const getCartItems = async () => {
    try {
        const response = await API.get("/cart", {withCredentials: true});
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const getCartItemQuantity = async () => {
    try {
        const response = await API.get('/cart/quantity', {
            withCredentials: true,
        });
        return response.data.cartQuantity;  // Update this based on the correct response format
    } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
    }
}
