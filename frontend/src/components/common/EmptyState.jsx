const EmptyState = ({ message }) => {
    return (
        <div>
            <p>{message || 'No data available'}</p>
        </div>
    );
};

export default EmptyState;
