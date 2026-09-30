export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 8;
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.trim() !== '';
};

export const validateAmount = (amount) => {
    return !isNaN(amount) && parseFloat(amount) > 0;
};

export const validateDate = (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};
