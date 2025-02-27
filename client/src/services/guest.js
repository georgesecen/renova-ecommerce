import API from './axiosInstance';

//Create guest user
export const createGuestUser = async (session_token,expiry) => {
    console.log("Attempting to register a new guest user");
    return API.post(`/guest/register`, {session_token, expiry}, {withCredentials: true});
}

export const getGuestUser = async () => {
    const guestUserId = localStorage.getItem('guestUserId');  // Retrieve guestUserId
    if (!guestUserId) {
        console.warn("No guest user ID found in localStorage.");
        return null;
    }
    try {
        const response = await API.get(`/guest/${guestUserId}`, {withCredentials:true});  // Fetch guest user by ID
        return response.data;
    } catch (error) {
        console.error('Error fetching guest user:', error);
        return null;
    }
};