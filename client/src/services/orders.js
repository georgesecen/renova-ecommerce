import API from "./axiosInstance";

export const getOrders = async ({key}) => {
    try {
        return await API.post(`/orders/get-orders`, {key});
    } catch(error){
        console.log(error)
    }
}