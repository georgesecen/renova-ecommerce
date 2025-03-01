import API from "./axiosInstance";

/**
 * Gets orders from server.
 * @returns {Object} AxiosResponse object.
 */
export const getOrders = async () => {
    try {
        return await API.post(`/orders/get-orders`, {adminPassword: sessionStorage.getItem("key")});
    } catch(error){
        console.log(error)
    }
}

/**
 * Update order status.
 * @param {number} id ID of order to be updated.
 * @param {string} status Order status to be updated to.
 * @returns 
 */
export const updateOrderStatus = async (id, status) => {
    try {
        return await API.post(`/orders/update-order-status`, {
            adminPassword: sessionStorage.getItem("key"),
            id: id,
            status: status
        });
    } catch(error){
        console.log(error)
    }
}