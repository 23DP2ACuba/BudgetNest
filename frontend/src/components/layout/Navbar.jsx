import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout as logoutApi } from '../../api/auth';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const navItems = [
        { label: t('common.dashboard'), path: '/dashboard' },
        { label: t('common.transactions'), path: '/transactions' },
        { label: t('common.budgets'), path: '/budgets' },
        ...(user?.role === 'admin'
            ? [{ label: t('common.admin'), path: '/admin' }]
            : []),
        { label: t('common.profile'), path: '/profile' },
    ];

    const linkClassName = ({ isActive }) => (
        `flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
    );

    const handleLogout = async () => {
        try {
            await logoutApi();
            logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setLangOpen(false);
    };

    const languageSelector = (id) => (
        <div className="relative">
            <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                aria-expanded={langOpen}
                aria-controls={id}
                className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {i18n.language === 'lv' ? 'LV' : 'EN'}
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {langOpen && (
                <div id={id} className="absolute right-0 z-50 mt-2 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => changeLanguage('en')}
                        className={`block min-h-11 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                            i18n.language === 'en' ? 'bg-indigo-50 font-medium text-indigo-600' : 'text-gray-700'
                        }`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        onClick={() => changeLanguage('lv')}
                        className={`block min-h-11 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                            i18n.language === 'lv' ? 'bg-indigo-50 font-medium text-indigo-600' : 'text-gray-700'
                        }`}
                    >
                        Latviešu
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <NavLink
                    to="/dashboard"
                    className="shrink-0 text-xl font-bold text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                >
                    {t('common.appName')}
                </NavLink>

                <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={linkClassName}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <span className="max-w-40 truncate text-sm text-gray-700">{user?.name}</span>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="min-h-11 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                        {t('common.logout')}
                    </button>
                    {languageSelector('desktop-language-menu')}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    {languageSelector('mobile-language-menu')}
                    <button
                        type="button"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <svg
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav
                    id="mobile-navigation"
                    aria-label="Main navigation"
                    className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 shadow-md lg:hidden"
                >
                    <div className="mx-auto max-w-7xl space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={linkClassName}
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        {user?.name && (
                            <p className="px-3 py-2 text-sm text-gray-500">{user.name}</p>
                        )}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex min-h-11 w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        >
                            {t('common.logout')}
                        </button>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Navbar;
