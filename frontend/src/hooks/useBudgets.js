import { useState, useEffect } from 'react';
import { getBudgets } from '../api/budgets';

export const useBudgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                setLoading(true);
                const data = await getBudgets();
                setBudgets(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, []);

    return { budgets, loading, error };
};
