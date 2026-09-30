import axiosInstance from './axios';

export const getBudgets = async () => {
    const response = await axiosInstance.get('/budgets');
    return response.data;
};

export const getBudget = async (id) => {
    const response = await axiosInstance.get(`/budgets/${id}`);
    return response.data;
};

export const createBudget = async (data) => {
    const response = await axiosInstance.post('/budgets', data);
    return response.data;
};

export const updateBudget = async (id, data) => {
    const response = await axiosInstance.put(`/budgets/${id}`, data);
    return response.data;
};

export const deleteBudget = async (id) => {
    const response = await axiosInstance.delete(`/budgets/${id}`);
    return response.data;
};

export const inviteMember = async (budgetId, data) => {
    const response = await axiosInstance.post(`/budgets/${budgetId}/invite`, data);
    return response.data;
};

export const removeMember = async (budgetId, userId) => {
    const response = await axiosInstance.delete(`/budgets/${budgetId}/members/${userId}`);
    return response.data;
};
