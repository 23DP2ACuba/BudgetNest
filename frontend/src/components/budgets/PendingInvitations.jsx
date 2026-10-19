import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyInvitations, acceptInvitation, declineInvitation } from '../../api/budgets';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PendingInvitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        try {
            const data = await getMyInvitations();
            setInvitations(data || []);
        } catch (err) {
            setError('Failed to load invitations');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (budgetId) => {
        try {
            await acceptInvitation(budgetId);
            setInvitations((prev) => prev.filter((inv) => inv.id !== budgetId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to accept invitation');
        }
    };

    const handleDecline = async (budgetId) => {
        try {
            await declineInvitation(budgetId);
            setInvitations((prev) => prev.filter((inv) => inv.id !== budgetId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to decline invitation');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (invitations.length === 0) {
        return null;
    }

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
                <span className="text-amber-600 font-bold text-lg">📨</span>
                <h3 className="ml-2 text-lg font-semibold text-gray-900">Pending Invitations</h3>
            </div>
            {error && <Alert type="error" message={error} />}
            <div className="space-y-3">
                {invitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                        <div>
                            <p className="font-medium text-gray-900">
                                {invitation.name || 'Unnamed Budget'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Invited by {invitation.creator?.name || 'Unknown'}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleAccept(invitation.id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleDecline(invitation.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingInvitations;