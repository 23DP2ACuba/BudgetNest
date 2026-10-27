const EmptyState = ({ message, icon, action }) => {
    return (
        <div className="text-center py-12">
            {icon && (
                <div className="text-6xl mb-4">{icon}</div>
            )}
            <p className="text-gray-500 text-lg mb-4">{message || 'No data available'}</p>
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;