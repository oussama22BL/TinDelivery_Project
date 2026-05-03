import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    // Fonction pour vérifier si le lien est actif
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-20">
            
            {/* LOGO TIN DELIVERY */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-[#0F172A] p-2 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                    <i className="bi bi-truck text-white text-xl"></i>
                </div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">TinDelivery</h1>
            </div>
            
            {/* NAVIGATION PRINCIPALE */}
            <nav className="flex-1 px-4 space-y-2 mt-6">
                <NavItem 
                    to="/admin/dashboard" 
                    icon="bi bi-grid-1x2" 
                    label="Dashboard" 
                    active={isActive('/admin/dashboard')} 
                />
                <NavItem 
                    to="/admin/colis" 
                    icon="bi bi-box-seam" 
                    label="Colis" 
                    active={isActive('/admin/colis')} 
                />
                <NavItem 
                    to="/admin/livraisons" 
                    icon="bi bi-truck" 
                    label="Livraisons" 
                    active={isActive('/admin/livraisons')} 
                />
                <NavItem 
                    to="/admin/livreurs" 
                    icon="bi bi-person-vcard" 
                    label="Livreurs" 
                    active={isActive('/admin/livreurs')} 
                />
            </nav>

            {/* BAS DE LA SIDEBAR (Aide & Déconnexion) */}
            <div className="p-6 border-t border-gray-50 space-y-2">
                <div className="flex items-center gap-4 px-4 py-3 text-slate-400 font-bold text-sm cursor-pointer hover:text-slate-600 hover:bg-gray-50 rounded-xl transition-all">
                    <i className="bi bi-question-circle text-lg"></i>
                    <span>Aide</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 text-red-400 font-bold text-sm cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <i className="bi bi-box-arrow-left text-lg"></i>
                    <span>Déconnexion</span>
                </div>
            </div>
        </div>
    );
};

/**
 * Petit composant interne pour chaque bouton du menu
 */
const NavItem = ({ to, icon, label, active }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
            active 
            ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100' 
            : 'text-slate-400 hover:bg-gray-50 hover:text-slate-600 border border-transparent'
        }`}
    >
        <i className={`${icon} text-lg ${active ? 'text-cyan-700' : 'opacity-60'}`}></i>
        <span>{label}</span>
    </Link>
);

export default Sidebar;