import axiosInstance from '../../api/axios';
import { useTranslation } from 'react-i18next';

const BudgetMembers = ({ members = [], budgetId, onRemove, onRoleChange }) => {
    const { t } = useTranslation();
    const handleRemove = async (userId) => {
        if (!confirm(t('common.areYouSureRemoveMember'))) return;
        try {
            await axiosInstance.delete(
                `/budgets/${budgetId}/members/${userId}`
            );
            onRemove?.(userId);
        } catch (err) {
            alert(t('common.failedToRemoveMember'));
        }
    };

    if (members.length === 0) {
        return <p className="text-gray-500 text-sm">{t('common.noData')}</p>;
    }

    return (
        <div className="space-y-3">
            {members.map((member) => (
                <div
                    key={member.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                    <div>
                        <p className="font-medium text-gray-900">
                            {member.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {member.email}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            member.pivot?.role === 'owner'
                                ? 'bg-indigo-100 text-indigo-800'
                                : member.pivot?.role === 'editor'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {member.pivot?.role || t('common.member')}
                        </span>
                        {member.pivot?.role !== 'owner' && (
                            <button
                                onClick={() => handleRemove(member.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                {t('common.remove')}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BudgetMembers;