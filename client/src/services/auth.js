import API from './axiosInstance';

// Function to refresh the access token using the refresh token
//TODO read over
export const refreshAccessToken = async () => {
    try {
        const response = await API.post('/refresh-token', { withCredentials: true });
        return response.data.accessToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw new Error("Unable to refresh token");
    }
};