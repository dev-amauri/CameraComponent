import axios from 'axios';

const API_URL = 'https://ocr-api-33ju.onrender.com';
const API_KEY = 'SWarEukc1L4laIVSEcygi1UirNPsQteRbR9Tg08FaEO05TjV5GkFwb5BxQF51OEb'

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;