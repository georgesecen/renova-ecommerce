import API from './axiosInstance'

/**
 * Sends a request to the server to perform CRUD product variant operations.
 * @param {string} operation The operation to perform. Refer to productVariantController.js to see what 
 * each option requires as data. Valid options are:
 * - create
 * - delete
 * - update-quantity
 * - delete-group
 * - update-group-price
 * - add-group-image
 * - remove-group-image
 * @param {object} requestData Data to send in the request.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const adminProductVariantsService = async (operation, requestData) => {
    try {

        // Add admin password to the request data being sent to server
        requestData.adminPassword = sessionStorage.getItem("key")

        // Make sure correct headers are set when sending file data to server
        const contentType = (operation === "add-group-image") ? {"Content-Type": "multipart/form-data"} : {}

        return await API.post(
            `/product-variants/${operation}`, 
            requestData,
            {
                headers: contentType
            }
        )
    } catch(error){
        console.log(error)
    }
}