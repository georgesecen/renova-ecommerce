import API from "./axiosInstance";

/**
 * Gets orders from server.
 * @param {number} key Authentication key.
 * @returns {Object} AxiosResponse object.
 */
export const getOrders = async (key) => {
    try {
        return await API.post(`/orders/get-orders`, {adminPassword: key});
    } catch(error){
        console.log(error)
    }
}