import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Utilise le composant unique

const Profile = () => {
    // 1. DONNÉES SIMULÉES (Tu changeras 'admin' en 'livreur' pour tester l'autre vue)
    const [user] = useState({
        _id: "69f39c3834fe5824e2b096f4",
        nomComplet: "Wassima Kella",
        email: "wassima.kella@gmail.com",
        telephone: "0796967071",
        adresse: "Hay Tayerte El Oulya, Bloc B, Rabat",
        role: "livreur", // Change ici pour tester : 'admin' ou 'livreur'
        status: "actif",
        nombreLivraison: 12,
        createdAt: "2024-03-01T10:00:00Z"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* ON PASSE LE ROLE DYNAMIQUEMENT À LA SIDEBAR UNIQUE */}
            <Sidebar role={user.role} />

            <div className="flex-1 ml-64 p-12 text-left">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Mon Profil</h1>
                        <p className="text-slate-400 font-medium">Gestion de votre compte {user.role === 'admin' ? 'Administrateur' : 'Livreur'}</p>
                    </div>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                            <i className="bi bi-pencil-square"></i> Modifier le profil
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                        {/* Header interne du profil */}
                        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-cyan-500 to-cyan-700 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                                {user.nomComplet.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800">{user.nomComplet}</h2>
                                <span className="inline-block mt-1 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* Formulaire */}
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileField label="Nom Complet" value={formData.nomComplet} isEditing={isEditing} onChange={(val) => setFormData({...formData, nomComplet: val})} icon="bi-person" />
                            <ProfileField label="Email" value={formData.email} isEditing={isEditing} onChange={(val) => setFormData({...formData, email: val})} icon="bi-envelope" />
                            <ProfileField label="Téléphone" value={formData.telephone} isEditing={isEditing} onChange={(val) => setFormData({...formData, telephone: val})} icon="bi-telephone" />
                            <ProfileField label="Adresse" value={formData.adresse} isEditing={isEditing} onChange={(val) => setFormData({...formData, adresse: val})} icon="bi-geo-alt" />
                        </form>
                    </div>

                    {/* Bloc Stats (À droite) */}
                    <div className="space-y-6">
                        {/* ON N'AFFICHE CE BLOC QUE POUR LE LIVREUR */}
                        {user.role === 'livreur' && (
                            <div className="bg-[#013c58] p-8 rounded-[35px] text-white shadow-xl relative overflow-hidden">
                                <p className="text-[10px] font-bold opacity-60 uppercase mb-6">Performances</p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-3xl font-black">{user.nombreLivraison}</p>
                                        <p className="text-[10px] opacity-60 uppercase font-bold">Livraisons effectuées</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-3xl font-black">98%</p>
                                        <p className="text-[10px] opacity-60 uppercase font-bold">Satisfaction Client</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Détails Système</p>
                            <div className="space-y-6">
                                <StaticInfo label="Identifiant" value={`ID-${user._id.slice(-6).toUpperCase()}`} />
                                <StaticInfo label="Inscrit le" value={new Date(user.createdAt).toLocaleDateString()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composants internes pour la propreté
const ProfileField = ({ label, value, isEditing, onChange, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
            <i className={icon}></i> {label}
        </label>
        {isEditing ? (
            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <p className="text-sm font-bold text-slate-700 p-3 bg-slate-50/50 rounded-xl">{value}</p>
        )}
    </div>
);

const StaticInfo = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
);

export default Profile;