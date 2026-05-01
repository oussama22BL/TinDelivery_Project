import React, { useState } from 'react';
import SidebarAdmin from './AdminComponent/Sidebar';
import SidebarLivreur from './LivreurComponent/SidebarLivreur';

const Profile = () => {
    // 1. DONNÉES SIMULÉES (En attendant le back d'Oussama)
    const mockUser = {
        _id: "69f39c3834fe5824e2b096f4",
        nomComplet: "Wassima Kella",
        email: "wassima.kella@gmail.com",
        telephone: "0796967071",
        adresse: "Hay Tayerte El Oulya, Bloc B, Rabat",
        role: "admin", // Change en "admin" pour voir l'autre sidebar
        status: "actif",
        disponibilite: true,
        nombreLivraison: 12,
        createdAt: "2024-03-01T10:00:00Z"
    };

    const [user] = useState(mockUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nomComplet: mockUser.nomComplet,
        email: mockUser.email,
        telephone: mockUser.telephone,
        adresse: mockUser.adresse
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        // Pour l'instant, on simule juste le succès
        alert("Côté Front OK ! Les données seront envoyées quand le Backend sera prêt.");
        setIsEditing(false);
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar dynamique selon le rôle simulé */}
            {user.role === 'admin' ? <SidebarAdmin /> : <SidebarLivreur />}

            <div className="flex-1 ml-64 p-12">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight text-left">Mon Profil</h1>
                        <p className="text-slate-400 font-medium text-left">Gérez vos informations personnelles ({user.role}).</p>
                    </div>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="bg-cyan-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                            <i className="bi bi-pencil-square"></i> Modifier
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white rounded-[32px] p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50 text-left">
                            <div className="w-24 h-24 rounded-[28px] bg-cyan-900 text-white flex items-center justify-center text-3xl font-black shadow-lg uppercase">
                                {user.nomComplet.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 text-left">{user.nomComplet}</h2>
                                <p className="text-cyan-600 font-bold text-xs uppercase tracking-widest text-left">{user.role}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <ProfileField label="Nom Complet" value={formData.nomComplet} isEditing={isEditing} onChange={(val) => setFormData({...formData, nomComplet: val})} icon="bi-person" />
                                <ProfileField label="Adresse Email" value={formData.email} isEditing={isEditing} onChange={(val) => setFormData({...formData, email: val})} icon="bi-envelope" />
                                <ProfileField label="Téléphone" value={formData.telephone} isEditing={isEditing} onChange={(val) => setFormData({...formData, telephone: val})} icon="bi-telephone" />
                                <ProfileField label="Adresse Résidentielle" value={formData.adresse} isEditing={isEditing} onChange={(val) => setFormData({...formData, adresse: val})} icon="bi-geo-alt" />
                            </div>

                            {isEditing && (
                                <div className="mt-10 flex gap-4">
                                    <button type="submit" className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-700 transition-all">Sauvegarder</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold">Annuler</button>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="space-y-6 text-left">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Stats Chauffeur</p>
                            <div className="space-y-6">
                                <StaticInfo label="Identifiant" value={`TD-${user._id.slice(-6).toUpperCase()}`} />
                                <StaticInfo label="Statut" value={user.status} color="text-green-600" />
                                <StaticInfo label="Livraisons" value={user.nombreLivraison} />
                                <StaticInfo label="Date d'inscription" value={new Date(user.createdAt).toLocaleDateString()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ label, value, isEditing, onChange, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <i className={`${icon}`}></i> {label}
        </label>
        {isEditing ? (
            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-cyan-500" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <p className="text-sm font-bold text-slate-700 p-3 bg-slate-50/50 rounded-xl">{value}</p>
        )}
    </div>
);

const StaticInfo = ({ label, value, color = "text-slate-800" }) => (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
);

export default Profile;