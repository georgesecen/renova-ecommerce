import axios from "axios";

// set up url to match express
const API = axios.create({
    baseURL: 'http://localhost:3306',
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');  // Retrieve token from localStorage
        console.log("Intercepting request. Token:", token);
        if (token) {
            console.log('token provided');
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(config.headers['Authorization'])// Add token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getProducts = () => {
    return API.get("/products");
}
export const addProduct = (product) => {
    return API.post("/cart", product);
}
export const removeCartItem = (cartItem) => {
    console.log(`Attempting to delete /cart/${cartItem.cart_item_id}`);
    return API.delete(`/cart/${cartItem.cart_item_id}`, {
        data: {
            product_id: cartItem.cart_item_id,
            quantity: cartItem.quantity,
        },
    });
};

export const addUser = (email,password,username,uuid) => {
    console.log("Attempting to register a new user");
    return API.post(`/user/register`, {email,password,username,uuid});
}

export const loginUser = (email,password) => {
    console.log("Attempting to login user");
    return API.post(`/user/login`,{email,password})
}


export const getCartItems = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        // console.log('Token retrieved from localStorage:', token);
        if (!token) {
            throw new Error("JWT token is missing");
        }
        // console.log('Token before request:', token);
        const response = await API.get('/cart'
        );
        console.log(response);
        return response.data;  // Return cart data from the server

    } catch (error) {
        console.error('Error fetching cart:', error);
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error Request:', error.request);
        } else {
            // Something else triggered the error
            console.error('Error Message:', error.message);
        }
        throw error;  // Rethrow the error to let the component handle it
    }
};

