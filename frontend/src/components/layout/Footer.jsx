import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-center text-sm">
            <p>
                BudgetNest &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="mt-2">
                <Link to="/" className="text-indigo-400 hover:text-indigo-300">
                    Back to Home
                </Link>
            </div>
        </footer>
    );
};

export default Footer;