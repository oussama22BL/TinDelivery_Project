import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// RÉUTILISATION DES COMPOSANTS DÉJÀ EXISTANTS (Pas de répétition de code)
import Sidebar from './Sidebar'; 
import TopBar from './TopBar'; 
import MessageModal from '../components/AdminComponent/MessageModal';

const Profile = () => {
    const navigate = useNavigate();
    
    // États pour les données
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    // État pour la modale de message (Email existant ou succès)
    const [msgModal, setMsgModal] = useState({ show: false, title: '', message: '', type: 'error' });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            navigate('/connexion'); 
        } else {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setFormData(parsedUser);
            setLoading(false);
        }
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Mise à jour API
            await axios.patch(`/api/users/profile/${user._id}`, formData);
            
            // Mise à jour LocalStorage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);

            // Modale de succès
            setMsgModal({
                show: true,
                title: "Profil à jour",
                message: "Vos modifications ont été enregistrées avec succès.",
                type: "success"
            });
        } catch (err) {
            setMsgModal({
                show: true,
                title: "Erreur",
                message: "Impossible de mettre à jour le profil. L'email est peut-être déjà utilisé.",
                type: "error"
            });
        }
    };

    if (loading || !user) return null; // Sécurité anti-page blanche

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* UTILISATION DE LA SIDEBAR EXISTANTE */}
            <Sidebar role={user.role} />

            <div className="flex-1 ml-64 flex flex-col">
                {/* UTILISATION DE LA TOPBAR EXISTANTE (Cohérence visuelle) */}
                <TopBar />

                <main className="p-12 text-left">
                    <header className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Mon Profil</h1>
                            <p className="text-slate-400 font-medium text-xs uppercase tracking-widest mt-1">
                                {user.role === 'admin' ? 'Administration Système' : 'Espace Livreur Partenaire'}
                            </p>
                        </div>
                        
                        <div>
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Annuler</button>
                                    <button onClick={handleSave} className="bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-cyan-700 shadow-lg transition-all">Sauvegarder</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="bg-[#0f172a] text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 text-xs uppercase tracking-widest">
                                    <i className="bi bi-pencil-square"></i> Modifier
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Carte Principale */}
                        <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                                <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#013c58] to-slate-800 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                                    {user.nomComplet?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800">{user.nomComplet}</h2>
                                    <span className="inline-block mt-1 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                                        Compte {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField label="Nom Complet" value={formData.nomComplet} isEditing={isEditing} onChange={(val) => setFormData({...formData, nomComplet: val})} icon="bi-person" />
                                <ProfileField label="Email" value={formData.email} isEditing={isEditing} onChange={(val) => setFormData({...formData, email: val})} icon="bi-envelope" />
                                <ProfileField label="Téléphone" value={formData.telephone} isEditing={isEditing} onChange={(val) => setFormData({...formData, telephone: val.replace(/\D/g, "")})} icon="bi-telephone" />
                                <ProfileField label="Adresse" value={formData.adresse} isEditing={isEditing} onChange={(val) => setFormData({...formData, adresse: val})} icon="bi-geo-alt" />
                            </div>
                        </div>

                        {/* Bloc Stats / Infos */}
                        <div className="space-y-6">
                            {user.role === 'livreur' && (
                                <div className="bg-[#013c58] p-8 rounded-[35px] text-white shadow-xl relative overflow-hidden">
                                    <p className="text-[10px] font-bold opacity-60 uppercase mb-6 tracking-widest">Activité</p>
                                    <p className="text-3xl font-black">{user.nombreLivraison || 0}</p>
                                    <p className="text-[10px] opacity-60 uppercase font-bold">Colis livrés avec succès</p>
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full"></div>
                                </div>
                            )}

                            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Paramètres</p>
                                <StaticInfo label="ID Utilisateur" value={`ID-${user._id?.slice(-8).toUpperCase()}`} />
                                <div className="h-4"></div>
                                <StaticInfo label="Statut du compte" value={user.status?.toUpperCase()} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* MODALE DE MESSAGE UNIQUE POUR LES ERREURS ET SUCCÈS */}
            <MessageModal 
                isOpen={msgModal.show} 
                onClose={() => setMsgModal({ ...msgModal, show: false })}
                title={msgModal.title}
                message={msgModal.message}
                type={msgModal.type}
            />
        </div>
    );
};

const ProfileField = ({ label, value, isEditing, onChange, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 ml-1">
            <i className={icon}></i> {label}
        </label>
        {isEditing ? (
            <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <p className="text-sm font-bold text-slate-700 p-4 bg-slate-50/50 rounded-2xl border border-transparent">{value || '---'}</p>
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