import axiosInstance from './axios';

export const getTransactions = async (budgetId, params) => {
    const response = await axiosInstance.get(`/budgets/${budgetId}/transactions`, { params });
    return response.data;
};

export const getTransaction = async (id) => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
};

export const createTransaction = async (data) => {
    const response = await axiosInstance.post('/transactions', data);
    return response.data;
};

export const updateTransaction = async (id, data) => {
    const response = await axiosInstance.put(`/transactions/${id}`, data);
    return response.data;
};

export const deleteTransaction = async (id) => {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
};
