import API from "./axiosInstance";

//Register user
export const addUser = (uuid,username,email,password) => {
    console.log("Attempting to register a new user");
    return API.post(`/user/register`, {uuid,username,email,password}, {withCredentials: true});
}
//User login
export const loginUser = async (email,password) => {
    try {
        return await API.post(`/user/login`, {email,password}, {withCredentials: true});
    } catch(error) {
        console.error("login error: ", error);
        throw error;
    }
}
export const logoutUser = async () => {
    try {
        return await API.post('user/logout', {}, {withCredentials: true});
    } catch (error) {
        console.error("logoutUser");
        throw error;
    }
}