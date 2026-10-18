import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBudget, inviteMember, removeMember, leaveBudget } from '../api/budgets';
import { getTransactions } from '../api/transactions';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../utils/formatters';

const BudgetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [budget, setBudget] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [inviteData, setInviteData] = useState({
        email: '',
        role: 'viewer',
    });
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
    });
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchBudgetData();
    }, [id]);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            const [budgetData, transactionsData] = await Promise.all([
                getBudget(id),
                getTransactions(id),
            ]);
            
            setBudget(budgetData);
            setTransactions(transactionsData.data || transactionsData);

            // Calculate stats
            const income = (transactionsData.data || transactionsData)
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
            const expenses = (transactionsData.data || transactionsData)
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            setStats({
                totalIncome: income,
                totalExpenses: expenses,
                balance: income - expenses,
            });
        } catch (err) {
            setError('Failed to load budget details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await inviteMember(id, inviteData);
            setSuccess('Member invited successfully');
            setIsInviteModalOpen(false);
            setInviteData({ email: '', role: 'viewer' });
            fetchBudgetData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to invite member');
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            await removeMember(id, userId);
            setSuccess('Member removed successfully');
            fetchBudgetData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to remove member');
        }
    };

    const handleLeaveBudget = async () => {
        if (!confirm('Are you sure you want to leave this budget?')) return;

        try {
            await leaveBudget(id);
            setSuccess('You have left the budget.');
            setTimeout(() => navigate('/budgets'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to leave budget');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!budget) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Alert type="error" message="Budget not found" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/budgets')}
                        className="text-indigo-600 hover:text-indigo-700 mb-4"
                    >
                        ← Back to Budgets
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{budget.name}</h1>
                    {budget.description && (
                        <p className="mt-2 text-gray-600">{budget.description}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
                    </p>
                </div>

                {success && <Alert type="success" message={success} />}
                {error && <Alert type="error" message={error} />}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Total Budget</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(budget.total_amount)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Total Income</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Balance</p>
                        <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(stats.balance)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transactions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
                            </div>
                            <div className="p-6">
                                {transactions.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No transactions yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {transactions.slice(0, 10).map((transaction) => (
                                            <div key={transaction.id} className="flex justify-between items-center py-3 border-b last:border-0">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {transaction.description || transaction.category?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(transaction.transaction_date)} • {transaction.category?.name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-semibold ${
                                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {transaction.type === 'income' ? '+' : '-'}
                                                        {formatCurrency(transaction.amount)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{transaction.user?.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Members */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Members</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsInviteModalOpen(true)}
                                        className="text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        + Invite
                                    </button>
                                    <button
                                        onClick={handleLeaveBudget}
                                        disabled={isLeaving}
                                        className={`text-sm ${isLeaving ? 'text-gray-400' : 'text-red-600'} hover:${isLeaving ? 'text-gray-400' : 'text-red-700'}`}
                                    >
                                        {isLeaving ? 'Leaving...' : 'Leave Budget'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {budget.users?.map((member) => (
                                        <div key={member.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                    {member.pivot?.role || 'member'}
                                                </span>
                                            </div>
                                            {budget.created_by !== member.id && (
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Invite Member</h2>
                    
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={inviteData.email}
                                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="member@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                value={inviteData.role}
                                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="viewer">Viewer (Read only)</option>
                                <option value="editor">Editor (Can add/edit transactions)</option>
                                <option value="owner">Owner (Full access)</option>
                            </select>
                        </div>

                        {error && <Alert type="error" message={error} />}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsInviteModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Send Invitation
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default BudgetDetail;