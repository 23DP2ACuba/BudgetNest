import { useState } from 'react';
import axiosInstance from '../../api/axios';
import { useTranslation } from 'react-i18next';

const InviteMembers = ({ budgetId, onInvite, onClose }) => {
    const { t } = useTranslation();
    const [inviteData, setInviteData] = useState({
        email: '',
        role: 'viewer',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setInviteData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axiosInstance.post(`/budgets/${budgetId}/invite`, inviteData);
            onInvite?.();
            onClose?.();
        } catch (err) {
            setError(
                err.response?.data?.message || t('common.failedToInviteMember')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.emailAddress')}
                </label>
                <input
                    type="email"
                    name="email"
                    value={inviteData.email}
                    onChange={handleChange}
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
                    name="role"
                    value={inviteData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="viewer">{t('common.viewer')}</option>
                    <option value="editor">{t('common.editor')}</option>
                    <option value="owner">{t('common.owner')}</option>
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex justify-end space-x-3 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? t('common.sending') : t('common.sendInvitation')}
                </button>
            </div>
        </form>
    );
};

export default InviteMembers;