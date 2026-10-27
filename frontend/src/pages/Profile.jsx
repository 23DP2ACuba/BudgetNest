import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { deleteAccount, updateProfile, updatePassword } from '../api/auth';
import Navbar from '../components/layout/Navbar';
import Alert from '../components/ui/Alert';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = await updateProfile(formData);
            setSuccess(data.message || t('common.profileUpdated'));
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || t('common.failedToUpdateProfile'));
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            setError(t('common.passwordsDoNotMatch'));
            return;
        }

        try {
            await updatePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                new_password_confirmation: passwordData.new_password_confirmation,
            });
            setSuccess(t('common.passwordUpdated'));
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || t('common.failedToUpdatePassword'));
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!window.confirm(t('common.confirmDeleteAccount'))) {
            return;
        }

        setIsDeletingAccount(true);
        try {
            await deleteAccount(deletePassword);
            logout();
            navigate('/login', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.errors?.password?.[0]
                || err.response?.data?.errors?.account?.[0]
                || err.response?.data?.message
                || t('common.failedToDeleteAccount')
            );
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('common.profileSettings')}</h1>

                {success && <Alert type="success" message={success} />}
                {error && <Alert type="error" message={error} />}

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">{t('common.profileInformation')}</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                {t('common.edit')}
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('common.fullName')}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('common.emailAddress')}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user?.name || '',
                                                email: user?.email || '',
                                            });
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        {t('common.saveChanges')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('common.fullName')}
                                    </label>
                                    <p className="mt-1 text-gray-900">{user?.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('common.emailAddress')}
                                    </label>
                                    <p className="mt-1 text-gray-900">{user?.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('common.accountRole')}
                                    </label>
                                    <p className="mt-1">
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            {user?.role || t('common.member')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mb-6 border border-red-200">
                    <div className="px-6 py-4 border-b border-red-100">
                        <h2 className="text-xl font-semibold text-red-700">{t('common.deleteAccount')}</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-700 mb-4">
                            {t('common.deleteAccountWarning')}
                            {user?.role === 'admin' && ` ${t('common.lastAdminCannotDelete')}`}
                        </p>
                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <div>
                                <label htmlFor="delete-account-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('common.confirmWithPassword')}
                                </label>
                                <input
                                    id="delete-account-password"
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isDeletingAccount}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isDeletingAccount ? t('common.deletingAccount') : t('common.deleteMyAccount')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{t('common.changePassword')}</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('common.currentPassword')}
                                </label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('common.newPassword')}
                                </label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('common.confirmPassword')}
                                </label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    value={passwordData.new_password_confirmation}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {t('common.updatePassword')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;