import API from './axiosInstance';

export const getVariants = async (id) => {
    try {
        const response = await API.get(`/product-variants/products/${id}`, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.error("Error fetching variants:", error);
        throw error;
    }
};