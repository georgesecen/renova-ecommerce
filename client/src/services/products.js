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
 * @param {object} requestData Data to send in the request. Defaults to an empty object.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const adminProductsService = async (operation, requestData = {}) => {
    try {

        // Add admin password to the request data being sent to server
        requestData.adminPassword = sessionStorage.getItem("key")

        // Make sure correct headers are set when sending file data to server
        const contentType = (operation === "add-image") ? {"Content-Type": "multipart/form-data"} : {}

        return await API.post(
            `/products/${operation}`, 
            requestData,
            {
                headers: contentType
            }
        )
    } catch(error){
        console.log(error)
    }
}