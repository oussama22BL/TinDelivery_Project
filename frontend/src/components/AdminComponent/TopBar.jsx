import React from 'react';

const TopBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-10 sticky top-0 z-10">
            {/* Barre de recherche (Design Maquette) */}
            <div className="relative w-96">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></span>
                <input 
                    type="text"
                    placeholder="Rechercher un livreur, un colis..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Profil & Settings */}
            <div className="flex items-center gap-5">
                <button className="text-gray-400 hover:text-gray-600">⚙️</button>
                <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff" alt="User" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;