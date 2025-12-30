import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000/api/v1/';


export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'multipart/form-data',
	},
});

export const axiosWithoutMultipart = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosWithoutMultipart.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleUnauthorized = (error: any) => {
	if (error.response?.status === 401) {
		localStorage.removeItem('authToken');

		if (!window.location.pathname.includes('/login')) {
			window.location.href = '/login';
		}
	}
	return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);

axiosWithoutMultipart.interceptors.response.use(
	(response) => response,
	handleUnauthorized
);