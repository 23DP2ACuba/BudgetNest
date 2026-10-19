import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-20">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Welcome to</span>
                            <span className="block text-indigo-600">BudgetNest</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Your collaborative budget management solution. Track expenses, manage shared budgets, and achieve your financial goals together.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <Link
                                    to="/register"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                >
                                    Get started
                                </Link>
                            </div>
                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Track Expenses</h3>
                            <p className="mt-2 text-gray-600">
                                Easily record and categorize your income and expenses with our intuitive interface.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Shared Budgets</h3>
                            <p className="mt-2 text-gray-600">
                                Collaborate with family, roommates, or teams on shared budget management.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Insights & Reports</h3>
                            <p className="mt-2 text-gray-600">
                                Visualize your spending patterns with charts and detailed analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing; 