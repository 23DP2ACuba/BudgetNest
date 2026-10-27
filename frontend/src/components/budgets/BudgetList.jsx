import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

const BudgetList = ({ budgets = [], emptyMessage = 'No budgets yet' }) => {
    if (budgets.length === 0) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{emptyMessage}</p>
                <Link to="/budgets/create" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium">
                    Create your first budget
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
                <div key={budget.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {budget.name}
                            </h3>
                            {budget.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {budget.description}
                                </p>
                            )}
                        </div>
                        <Link
                            to={`/budgets/${budget.id}`}
                            className="text-indigo-600 hover:text-indigo-700"
                        >
                            View Details →
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Budget</span>
                            <span className="font-semibold text-gray-900">
                                {formatCurrency(budget.total_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Members</span>
                            <span className="text-gray-900">{budget.users?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Period</span>
                            <span className="text-gray-700">
                                {formatDate(budget.start_date)} -{' '}
                                {formatDate(budget.end_date)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BudgetList;