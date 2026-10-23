import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionCard = ({ transaction }) => {
    const isIncome = transaction.type === 'income';

    return (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex justify-between items-start">
            <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">
                    {transaction.description || transaction.category?.name || 'Transaction'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.transaction_date)} • {transaction.category?.name}
                </p>
            </div>
            <div className="text-right">
                <p className={`font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-400">{transaction.user?.name}</p>
            </div>
        </div>
    );
};

export default TransactionCard;