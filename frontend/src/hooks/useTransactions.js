import { useState, useEffect } from 'react';
import { getTransactions } from '../api/transactions';

export const useTransactions = (budgetId) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!budgetId) return;

        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const data = await getTransactions(budgetId);
                setTransactions(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [budgetId]);

    return { transactions, loading, error };
};
