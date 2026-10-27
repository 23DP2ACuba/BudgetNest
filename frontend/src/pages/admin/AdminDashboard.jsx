import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingUserId, setDeletingUserId] = useState(null);

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [dashboardResponse, usersResponse] = await Promise.all([
                axiosInstance.get('/admin/dashboard'),
                axiosInstance.get('/admin/users'),
            ]);
            setStats(dashboardResponse.data);
            setUsers(usersResponse.data.data || usersResponse.data);
        } catch (err) {
            setError(t('common.failedToLoadAdminData'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axiosInstance.get('/admin/users', {
                params: { search: searchTerm },
            });
            setUsers(response.data.data || response.data);
        } catch (err) {
            setError(t('common.searchFailed'));
        }
    };

    const handleDeleteUser = async (targetUser) => {
        const confirmed = window.confirm(t('common.confirmDeleteUser', {
            name: targetUser.name,
            email: targetUser.email,
        }));

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            setDeletingUserId(targetUser.id);
            await axiosInstance.delete(`/admin/users/${targetUser.id}`);
            setUsers((currentUsers) => currentUsers.filter(({ id }) => id !== targetUser.id));
            setStats((currentStats) => ({
                ...currentStats,
                total_users: Math.max(0, currentStats.total_users - 1),
                recent_users: currentStats.recent_users.filter(({ id }) => id !== targetUser.id),
            }));
        } catch (err) {
            setError(err.response?.data?.message || t('common.failedToDeleteUser'));
        } finally {
            setDeletingUserId(null);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('common.adminDashboard')}</h1>

                {error && <Alert type="error" message={error} />}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">{t('common.totalUsers')}</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                            </div>
                            <div className="bg-indigo-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">{t('common.totalBudgets')}</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.total_budgets || 0}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">{t('common.totalTransactions')}</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.total_transactions || 0}</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{t('common.recentUsers')}</h2>
                    </div>
                    <div className="p-6">
                        {stats?.recent_users && stats.recent_users.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recent_users.map((user) => (
                                    <div key={user.id} className="flex justify-between items-center py-3 border-b last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">{t('common.noUsersFound')}</p>
                        )}
                    </div>
                </div>

                {/* Users Management */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">{t('common.allUsers')}</h2>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder={t('common.searchUsers')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                                >
                                    {t('common.search')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('common.user')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('common.email')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('common.role')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('common.joined')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            {t('common.noUsersFound')}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((listedUser) => (
                                        <tr key={listedUser.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{listedUser.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {listedUser.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                    {listedUser.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(listedUser.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                {String(listedUser.id) === String(user?.id) ? (
                                                    <span className="text-gray-500">{t('common.you')}</span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(listedUser)}
                                                        disabled={deletingUserId !== null}
                                                        className="font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {deletingUserId === listedUser.id
                                                            ? t('common.loading')
                                                            : t('common.deleteUser')}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;