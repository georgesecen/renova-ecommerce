import API from "../services/axiosInstance";

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
        console.log("cart quantity: ",response);
        return response.data.cartQuantity;  // Update this based on the correct response format
    } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
    }
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