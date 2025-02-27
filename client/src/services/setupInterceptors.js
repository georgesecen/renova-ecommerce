import API from './axiosInstance';
import { refreshAccessToken } from "./auth";

// Set up Axios interceptor to handle expired access token
const setupInterceptors = () => {
    API.interceptors.response.use(
        response => response, // If response is successful, just return it
        async (error) => {
            const originalRequest = error.config;

            // If the error is a 401 (Unauthorized) and it hasn't been retried yet
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Mark the request as retried

                // Try to refresh the token
                try {
                    const newAccessToken = await refreshAccessToken();
                    // Update the request header with the new access token
                    API.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // axios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // Retry the original request with the new token
                    return API(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
}

export default setupInterceptors;
