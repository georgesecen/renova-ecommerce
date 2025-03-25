import API from "../services/axiosInstance";

export const getCartItems = async () => {
    const guestUserId = localStorage.getItem('guestUserId');
    console.log("getting guest user id from local storage in axios", guestUserId)
    try {
        const response = await API.get("/cart", {
        headers : { 'guest-user-id': guestUserId },
        withCredentials: true});
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
            headers: { 'guest-user-id': guestUserId },
            withCredentials: true,
        });
        console.log("cart quantity: ",response);
        return response.data.cartQuantity;  // Update this based on the correct response format
    } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
    }
}

export const addProduct = (product) => {
    const guestUserId = localStorage.getItem('guestUserId'); // Retrieve guest ID

    return API.post("/cart", product, {
        headers: { 'guest-user-id': guestUserId }, // Corrected headers structure
        withCredentials: true
    });
};
export const removeCartItem = (cartItem) => {
    const guestUserId = localStorage.getItem('guestUserId');
    console.log("guest user id from delete request",guestUserId)
    console.log(`Attempting to delete /cart/${cartItem.cart_item_id}`);
    return API.delete(`/cart/${cartItem.cart_item_id}`, {
        headers: { 'guest-user-id': guestUserId },
        withCredentials: true,
        data: {
            product_id: cartItem.cart_item_id,
            quantity: cartItem.quantity,
        },
    });
};