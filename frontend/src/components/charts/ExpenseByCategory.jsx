import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const COLORS = [
    '#ef4444',
    '#3b82f6',
    '#ec4899',
    '#8b5cf6',
    '#f59e0b',
    '#10b981',
    '#6366f1',
    '#14b8a6',
];

const ExpenseByCategory = ({ data = [] }) => {
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Expense by Category
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Legend verticalAlign="top" align="right" />
                        <Pie
                            data={data}
                            dataKey="amount"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            paddingAngle={3}
                            dataStartAngle={0}
                            dataEndAngle={360}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Tooltip
                                formatter={(value) => value.toFixed(2)}
                                content={({ active, name, value }) => {
                                    if (!active || !name || !value) return null;
                                    const pct = ((value / total) * 100).toFixed(1);
                                    return (
                                        <div className="p-2 bg-gray-900 text-white rounded text-sm">
                                            <p>{name}</p>
                                            <p>${value.toFixed(2)} ({pct}%)</p>
                                        </div>
                                    );
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {total > 0 && (
                <div className="mt-4 text-right">
                    <p className="text-sm font-bold text-gray-900">
                        Total: ${total.toFixed(2)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExpenseByCategory;