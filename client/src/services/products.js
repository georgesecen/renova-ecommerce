import API from './axiosInstance'

export const getProducts = () => {
    return API.get("/products", {withCredentials: true});
}

// TODO: Change function name
/**
 * Gets all products with their details from the database.
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const getProductsV2 = async () => {
    try {
        return await API.post(`/products/index`, {
            adminPassword: sessionStorage.getItem("key")
        });
    } catch(error){
        console.log(error)
    }
}

/**
 * Creates a product in the database.
 * @param {string} name Name of product.
 * @param {string} description Product description.
 * @param {number} price Price of product. (In dollars)
 * @returns {Promise<AxiosResponse>} AxiosResponse object.
 */
export const createProduct = async (name, description, price) => {
    try {
        return await API.post(`/products/create`, {
            adminPassword: sessionStorage.getItem("key"),
            name: name,
            description: description,
            price: price
        });
    } catch(error){
        console.log(error)
    }
}