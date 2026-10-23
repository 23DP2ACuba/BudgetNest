import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Transactions', path: '/transactions', icon: '💸' },
        { name: 'Budgets', path: '/budgets', icon: '💰' },
        { name: 'Categories', path: '/categories', icon: '📂' },
        ...(user?.role === 'admin'
            ? [{ name: 'Admin', path: '/admin', icon: '⚙️' }]
            : []),
        { name: 'Profile', path: '/profile', icon: '👤' },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 transform -translate-x-full sm:translate-x-0 sm:fixed sm:inset-y-0 ${
                collapsed ? '-translate-x-full' : 'translate-x-0'
            }`}
        >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                <span className="font-bold text-lg">BudgetNest</span>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-400 hover:text-white sm:hidden"
                >
                    {collapsed ? '›' : '‹'}
                </button>
            </div>

            <nav className="mt-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            typeof window !== 'undefined' &&
                            window.location.pathname === item.path
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                        <span className="w-8 text-center mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto p-4 border-t border-gray-700">
                <LogoutButton onLogout={logout} />
                <p className="text-xs text-gray-400 mt-2 text-center">
                    {user?.role?.toUpperCase()}
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;