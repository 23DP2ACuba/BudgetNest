const Select = ({ label, options = [], ...props }) => {
    return (
        <div>
            {label && <label>{label}</label>}
            <select {...props}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
