import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, UploadCloud, LayoutDashboard, Home } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/upload', label: 'Upload Data', icon: UploadCloud },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="bg-surface shadow-xl border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">DevAnalyzer</span>
                    </Link>
                    <div className="flex space-x-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                                            : 'text-muted hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
