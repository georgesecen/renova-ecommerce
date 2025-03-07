import API from './axiosInstance'

export const getProducts = () => {
    return API.get("/products", {withCredentials: true});
}

/**
 * Sends a request to the server to perform CRUD product operations.
 * @param {string} operation The operation to perform. Refer to productController.js to see what 
 * each option requires as data. Valid options are:
 * - create
 * - update
 * - delete
 * - add-image
 * - remove-image
 * - index
 * @param {Object} requestData Data to send in the request.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const adminProductsService = async (operation, requestData) => {
    try {

        // Add admin password to the request data being sent to server
        requestData.adminPassword = sessionStorage.getItem("key")

        return await API.post(`/products/${operation}`, {
            requestData
        });
    } catch(error){
        console.log(error)
    }
}