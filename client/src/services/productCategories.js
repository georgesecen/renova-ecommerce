import API from './axiosInstance'

/**
 * Sends a request to the server to perform CRUD product category operations.
 * @param {string} operation The operation to perform. Refer to productCategoryController.js to see what 
 * each option requires as data. Valid options are:
 * - create
 * - update
 * - delete
 * - index
 * @param {object} requestData Data to send in the request.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const adminProductCategoriesService = async (operation, requestData = {}) => {
    try {

        // Add admin password to the request data being sent to server
        requestData.adminPassword = sessionStorage.getItem("key")

        return await API.post(`/product-categories/${operation}`, requestData)
    } catch(error){
        console.log(error)
    }
}

export const getAllCategories = async () => {
    try {
        return await API.get("/product-categories/all")
    } catch(error){
        console.log(error)
    }
}