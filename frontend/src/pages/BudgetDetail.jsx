import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBudget, inviteMember, removeMember, leaveBudget } from '../api/budgets';
import { getTransactions } from '../api/transactions';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

const BudgetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
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
            setError(t('common.budgetNotFound'));
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
            setSuccess(t('common.memberInvited'));
            setIsInviteModalOpen(false);
            setInviteData({ email: '', role: 'viewer' });
            fetchBudgetData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || t('common.failedToInviteMember'));
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm(t('common.areYouSureRemoveMember'))) return;

        try {
            await removeMember(id, userId);
            setSuccess(t('common.memberRemoved'));
            fetchBudgetData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || t('common.failedToRemoveMember'));
        }
    };

    const handleLeaveBudget = async () => {
        if (!confirm(t('common.areYouSureLeaveBudget'))) return;

        try {
            await leaveBudget(id);
            setSuccess(t('common.budgetLeft'));
            setTimeout(() => navigate('/budgets'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || t('common.failedToLeaveBudget'));
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
                    <Alert type="error" message={t('common.budgetNotFound')} />
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
                        ← {t('common.backToBudgets')}
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
                        <p className="text-sm font-medium text-gray-600">{t('common.totalBudget')}</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(budget.total_amount)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">{t('common.totalIncome')}</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">{t('common.totalExpenses')}</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">{t('common.balance')}</p>
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
                                <h2 className="text-xl font-semibold text-gray-900">{t('common.transactions')}</h2>
                            </div>
                            <div className="p-6">
                                {transactions.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">{t('common.noTransactions')}</p>
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
                                <h2 className="text-xl font-semibold text-gray-900">{t('common.members')}</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsInviteModalOpen(true)}
                                        className="text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        + {t('common.invite')}
                                    </button>
                                    <button
                                        onClick={handleLeaveBudget}
                                        disabled={isLeaving}
                                        className={`text-sm ${isLeaving ? 'text-gray-400' : 'text-red-600'} hover:${isLeaving ? 'text-gray-400' : 'text-red-700'}`}
                                    >
                                        {isLeaving ? t('common.loading') : t('common.logout')}
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
                                                    {member.pivot?.role || t('common.member')}
                                                </span>
                                            </div>
                                            {budget.created_by !== member.id && (
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    {t('common.remove')}
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
                    <h2 className="text-2xl font-bold mb-4">{t('common.inviteMember')}</h2>
                    
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('common.emailAddress')}
                            </label>
                            <input
                                type="email"
                                value={inviteData.email}
                                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('common.emailAddress')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('common.role')}
                            </label>
                            <select
                                value={inviteData.role}
                                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="viewer">{t('common.viewer')}</option>
                                <option value="editor">{t('common.editor')}</option>
                                <option value="owner">{t('common.owner')}</option>
                            </select>
                        </div>

                        {error && <Alert type="error" message={error} />}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsInviteModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                {t('common.sendInvitation')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default BudgetDetail;