import { TransactionCard } from './TransactionCard';

const TransactionList = ({ transactions = [], emptyMessage = 'No transactions yet' }) => {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
        </div>
    );
};

export default TransactionList;