import axiosInstance from './axios';

export const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/user');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put('/auth/profile', profileData);
    return response.data;
};

export const updatePassword = async (passwordData) => {
    const response = await axiosInstance.put('/auth/password', passwordData);
    return response.data;
};

export const deleteAccount = async (password) => {
    const response = await axiosInstance.delete('/auth/profile', {
        data: { password },
    });
    return response.data;
};