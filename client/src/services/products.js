import API from './axiosInstance'

export const getProducts = () => {
    return API.get("/products", {withCredentials: true});
}