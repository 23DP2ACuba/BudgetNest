import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getBudgets } from '../api/budgets';
import { getAllTransactions } from '../api/transactions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/layout/Navbar';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBudgets: 0,
        totalIncome: 0,
        totalExpenses: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [budgetsData, transactionsData] = await Promise.all([
                getBudgets(),
                getAllTransactions(),
            ]);

            const allTransactions = transactionsData.data || transactionsData;
            setBudgets(budgetsData);
            setRecentTransactions(allTransactions.slice(0, 5));

            const income = allTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            const expenses = allTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            setStats({
                totalBudgets: budgetsData.length,
                totalIncome: income,
                totalExpenses: expenses,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Here's an overview of your financial activity
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total Budgets</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalBudgets}</p>
                            </div>
                            <div className="bg-indigo-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total Income</p>
                                <p className="text-3xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                <p className="text-3xl font-bold text-red-600">${stats.totalExpenses.toFixed(2)}</p>
                            </div>
                            <div className="bg-red-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                to="/transactions"
                                className="block w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                            >
                                <span className="text-indigo-700 font-medium">Add Transaction</span>
                            </Link>
                            <Link
                                to="/budgets"
                                className="block w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                            >
                                <span className="text-indigo-700 font-medium">Create Budget</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Budgets</h2>
                        {budgets.length === 0 ? (
                            <p className="text-gray-500">No budgets yet. Create your first budget!</p>
                        ) : (
                            <div className="space-y-3">
                                {budgets.slice(0, 3).map((budget) => (
                                    <Link
                                        key={budget.id}
                                        to={`/budgets/${budget.id}`}
                                        className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">{budget.name}</span>
                                            <span className="text-sm text-gray-600">${budget.total_amount}</span>
                                        </div>
                                    </Link>
                                ))}
                                {budgets.length > 3 && (
                                    <Link
                                        to="/budgets"
                                        className="block text-center text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        View all budgets
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                        <Link
                            to="/transactions"
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            View all
                        </Link>
                    </div>
                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-500">No transactions yet. Add your first transaction!</p>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex justify-between items-center py-3 border-b last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {transaction.description || transaction.category?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(transaction.transaction_date)} • {transaction.budget?.name} • {transaction.category?.name}
                                        </p>
                                    </div>
                                    <p className={`font-semibold ${
                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;