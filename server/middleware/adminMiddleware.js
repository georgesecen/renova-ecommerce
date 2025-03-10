
/**
 * Middleware function checks if the user attempting to access the route is an admin. If they are an 
 * admin the request will proceed otherwise it will respond with an error. Middleware is to be used on
 * all /admin routes.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 * @param {function} next The next middleware function in the chain.
 * @returns {void}
 */
const adminAuthentication = async (request, response, next) => {

    const {adminPassword} = request.body

    try{

        // TODO: Maybe check if user accessing the route is an admin in database instead of password

        // If user accessing the route is the admin
        if (adminPassword == process.env.ADMIN_PASSWORD){
            console.log("Admin accessing route.")
            next()
        }

        // If admin password is incorrect
        else{
            throw new Error("Incorrect password used trying to access admin only route.")
        }

    } catch (error){
        console.log(`Error in adminMiddleware.js function adminAuthentication: ${error.message}`)
        response.status(500).json({error: error.message})
    }    
}

module.exports = adminAuthentication;