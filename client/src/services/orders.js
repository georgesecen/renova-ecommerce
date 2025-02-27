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