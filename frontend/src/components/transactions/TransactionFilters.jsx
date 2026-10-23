import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TransactionFilters = ({ onFilterChange, initialFilters = {}, categories = [] }) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        type: initialFilters.type || '',
        category_id: initialFilters.category_id || '',
        start_date: initialFilters.start_date || '',
        end_date: initialFilters.end_date || '',
    });

    const handleChange = (key) => (e) => {
        setFilters((prev) => ({ ...prev, [key]: e.target.value }));
        onFilterChange?.({ ...filters, [key]: e.target.value });
    };

    const handleReset = () => {
        setFilters({ type: '', category_id: '', start_date: '', end_date: '' });
        onFilterChange?.({ type: '', category_id: '', start_date: '', end_date: '' });
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('common.filters')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t('common.type')}
                    </label>
                    <select
                        value={filters.type}
                        onChange={handleChange('type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="">{t('common.all')}</option>
                        <option value="income">{t('common.income')}</option>
                        <option value="expense">{t('common.expense')}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t('common.category')}
                    </label>
                    <select
                        value={filters.category_id}
                        onChange={handleChange('category_id')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="">{t('common.all')}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t('common.date')}
                    </label>
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={handleChange('start_date')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t('common.date')}
                    </label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={handleChange('end_date')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                    {t('common.reset')}
                </button>
            </div>
        </div>
    );
};

export default TransactionFilters;