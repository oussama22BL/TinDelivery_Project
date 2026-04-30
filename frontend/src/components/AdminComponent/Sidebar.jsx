import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    // Fonction pour savoir si on est sur la page active (pour la mettre en bleu)
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-black text-cyan-900 flex items-center gap-2">
                    <span className="bg-cyan-900 text-white p-1 rounded">📦</span> TinDelivery
                </h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <NavItem to="/admin/dashboard" icon="📊" label="Dashboard" active={isActive('/admin/dashboard')} />
                <NavItem to="/admin/colis" icon="📦" label="Colis" active={isActive('/admin/colis')} />
                <NavItem to="/admin/livraisons" icon="🚛" label="Livraisons" active={isActive('/admin/livraisons')} />
                <NavItem to="/admin/livreurs" icon="👤" label="Livreurs" active={isActive('/admin/livreurs')} />
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 text-red-500 font-medium p-2 w-full hover:bg-red-50 rounded-lg transition-all">
                    <span>🚪</span> Déconnexion
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${
        active ? 'bg-cyan-50 text-cyan-700 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
    }`}>
        <span className="text-lg">{icon}</span>
        <span className="text-sm">{label}</span>
    </Link>
);

export default Sidebar;