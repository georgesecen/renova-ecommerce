import API from "./axiosInstance";

/**
 * Sends a request to the server to perform CRUD order operations.
 * @param {string} operation The operation to perform. Refer to orderController.js to see what 
 * each option requires as data. Valid options are:
 * - update
 * - index
 * - refund
 * @param {object} requestData Data to send in the request.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const adminOrdersService = async (operation, requestData = {}) => {
    try {

        // Add admin password to the request data being sent to server
        requestData.adminPassword = sessionStorage.getItem("key")

        return await API.post(`/orders/${operation}`, requestData)
    } catch(error){
        console.log(error)
    }
}

/**
 * Gets all the orders and all order details of user with specified id.
 * @param {object} userId ID of user to get orders for.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const getUserOrders = async (userId) => {
    try {
        return await API.get(`/orders/user/${userId}`)
    } catch(error){
        console.log(error)
    }
}