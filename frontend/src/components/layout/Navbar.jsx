import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout as logoutApi } from '../../api/auth';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutApi();
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLangOpen(false);
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/dashboard" className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">{t('common.appName')}</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            >
                                {t('common.dashboard')}
                            </Link>
                            <Link
                                to="/transactions"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            >
                                {t('common.transactions')}
                            </Link>
                            <Link
                                to="/budgets"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            >
                                {t('common.budgets')}
                            </Link>
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    {t('common.admin')}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-sm text-gray-700 mr-4">{user?.name}</span>
                        </div>
                        <Link
                            to="/profile"
                            className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            {t('common.profile')}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            {t('common.logout')}
                        </button>
                        <div className="ml-4 relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center px-2 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <span className="text-lg mr-1">{i18n.language === 'lv' ? '🇱🇻' : '🇺🇸'}</span>
                                <span className="text-sm font-medium">{i18n.language === 'lv' ? 'LV' : 'EN'}</span>
                                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {langOpen && (
                                <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                                    <button
                                        onClick={() => changeLanguage('en')}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 {i18n.language === 'en' ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}"
                                    >
                                        <span className="mr-2">🇺🇸</span> English
                                    </button>
                                    <button
                                        onClick={() => changeLanguage('lv')}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 {i18n.language === 'lv' ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}"
                                    >
                                        <span className="mr-2">🇱🇻</span> Latviešu
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;