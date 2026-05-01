import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLivreur = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-20">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-[#0F172A] p-2 rounded-xl"><i className="bi bi-truck text-white text-xl"></i></div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">TinDelivery</h1>
                </div>
                
                {/* BLOC UTILISATEUR LIVREUR */}
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-cyan-900 overflow-hidden shadow-inner">
                        <img src="https://ui-avatars.com/api/?name=Jean+Marc&background=0e7490&color=fff" alt="avatar" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-800 leading-none">Espace Livreur</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Prêt pour la route</p>
                    </div>
                </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
                <NavItem to="/livreur/commandes" icon="bi-box-seam" label="Mes commandes" active={isActive('/livreur/commandes')} />
                <NavItem to="/profile" icon="bi-person-badge" label="Profil" active={isActive('/profile')} />
            </nav>

            <div className="p-6 border-t border-gray-50 text-red-400 font-bold text-sm flex items-center gap-4 cursor-pointer hover:text-red-600 transition-all">
                <i className="bi bi-box-arrow-left text-lg"></i>
                <span>Déconnexion</span>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100' : 'text-slate-400 hover:bg-gray-50'}`}>
        <i className={`bi ${icon} text-lg`}></i>
        <span>{label}</span>
    </Link>
);

export default SidebarLivreur;