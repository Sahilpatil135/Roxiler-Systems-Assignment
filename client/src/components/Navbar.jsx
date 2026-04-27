import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Store, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
            <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
                <Link to={user ? (user.role === 'ADMIN' ? '/admin' : user.role === 'STORE_OWNER' ? '/owner' : '/user') : '/'} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Store className="w-6 h-6 text-accent" />
                    <span className="text-xl font-bold tracking-wide">Review<span className="text-secondary">Hub</span></span>
                </Link>

                {user && (
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-secondary" />
                            <span className="font-medium">{user.name}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-accent">
                                {user.role === 'NORMAL' ? 'User' : user.role === 'STORE_OWNER' ? 'Owner' : 'Admin'}
                            </span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
