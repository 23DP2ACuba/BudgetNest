import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../api/budgets';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../utils/formatters';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        total_amount: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const data = await getBudgets();
            setBudgets(data);
        } catch (err) {
            setError('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (budget = null) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                name: budget.name,
                description: budget.description || '',
                total_amount: budget.total_amount,
                start_date: budget.start_date,
                end_date: budget.end_date,
            });
        } else {
            setEditingBudget(null);
            setFormData({
                name: '',
                description: '',
                total_amount: '',
                start_date: '',
                end_date: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingBudget) {
                await updateBudget(editingBudget.id, formData);
                setSuccess('Budget updated successfully');
            } else {
                await createBudget(formData);
                setSuccess('Budget created successfully');
            }
            handleCloseModal();
            fetchBudgets();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save budget');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this budget? All associated transactions will be deleted.')) return;

        try {
            await deleteBudget(id);
            setSuccess('Budget deleted successfully');
            fetchBudgets();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete budget');
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Create Budget
                    </button>
                </div>

                {success && <Alert type="success" message={success} />}
                {error && <Alert type="error" message={error} />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {budgets.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No budgets yet. Create your first budget!</p>
                        </div>
                    ) : (
                        budgets.map((budget) => (
                            <div key={budget.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(budget)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(budget.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {budget.description && (
                                    <p className="text-sm text-gray-600 mb-4">{budget.description}</p>
                                )}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Total Budget</span>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(budget.total_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Members</span>
                                        <span className="text-gray-900">{budget.users?.length || 0}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/budgets/${budget.id}`}
                                    className="mt-4 block w-full text-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Budget Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingBudget ? 'Edit Budget' : 'Create Budget'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Budget Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Household Budget"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Optional description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Amount
                            </label>
                            <input
                                type="number"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {error && <Alert type="error" message={error} />}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                {editingBudget ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Budgets;