import { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    const userData = await getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                localStorage.removeItem('auth_token');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('auth_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
