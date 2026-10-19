import { formatCurrency, formatDate } from '../../utils/formatters';

const BudgetCard = ({ budget, onEdit, onDelete, onView }) => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                    {budget.description && (
                        <p className="text-sm text-gray-500 mt-1">{budget.description}</p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit?.(budget)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete?.(budget.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Total Budget</span>
                    <span className="font-bold text-gray-900">
                        {formatCurrency(budget.total_amount)}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Period</span>
                    <span className="text-gray-700">
                        {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Members</span>
                    <span className="text-gray-700">{budget.users?.length || 0}</span>
                </div>
            </div>

            <button
                onClick={() => onView?.(budget.id)}
                className="w-full mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 text-sm font-medium"
            >
                View Details →
            </button>
        </div>
    );
};

export default BudgetCard;