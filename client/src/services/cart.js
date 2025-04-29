import API from "../services/axiosInstance";

export const getCartItems = async () => {
    const guestUserId = localStorage.getItem('guestUserId');
    console.log("getting guest user id from local storage in axios", guestUserId)
    try {
        const response = await API.get("/cart", {
            params : {
                guestUserId
            },
            headers : {
                'Content-Type': 'application/json',
                'guest-user-id': guestUserId
            },
        });
        console.log("response data from cart service file:", response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const getCartItemQuantity = async () => {
    const guestUserId = localStorage.getItem('guestUserId');
    try {
        const response = await API.get('/cart/quantity', {
            params: {
                guestUserId
            },
            headers: {
                'Content-Type': 'application/json',
                'guest-user-id': guestUserId
            },
        });
        console.log("cart quantity: ",response);
        return response.data.cartQuantity;  // Update this based on the correct response format
    } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
    }
}

export const updateCartItemQuantity = async (cartItemId, quantity) => {
    const guestUserId = localStorage.getItem('guestUserId');
    try {
        const response = await API.patch(`/cart/${cartItemId}`, { quantity, guestUserId}, {
            headers: {
                'Content-Type': 'application/json',
                'guest-user-id': guestUserId
            },
        });
        console.log("Updated cart item quantity:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error;
    }
};


export const addProduct = (product) => {
    //TODO change backend to expect product and guestuserid in the body
    const guestUserId = localStorage.getItem('guestUserId'); // Retrieve guest ID
    return API.post("/cart", product, {
        // return API.post("/cart", {product, guestUserId}, {
        headers: {
            'Content-Type': 'application/json',
            'guest-user-id': guestUserId
        },
    });
};

export const removeCartItem = (cartItem) => {
    const guestUserId = localStorage.getItem('guestUserId');
    console.log("guest user id from delete request",guestUserId)
    console.log(`Attempting to delete /cart/${cartItem.cart_item_id}`);
    return API.delete(`/cart/${cartItem.cart_item_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'guest-user-id': guestUserId
        },
        data: {
            product_id: cartItem.cart_item_id,
            quantity: cartItem.quantity,
        },
    });
};