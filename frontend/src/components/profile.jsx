import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// RÉUTILISATION DES COMPOSANTS (Zéro répétition)
import Sidebar from './Sidebar'; 
import TopBar from './TopBar'; 
import MessageModal from '../components/AdminComponent/MessageModal';

const Profile = () => {
    const navigate = useNavigate();
    
    // ÉTATS
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [msgModal, setMsgModal] = useState({ show: false, title: '', message: '', type: 'error' });

    // 1. CHARGEMENT DYNAMIQUE
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

    // 2. SAUVEGARDE
    const handleSave = async (e) => {
        e.preventDefault();

        // Validation téléphone (10 chiffres)
        if (formData.telephone && formData.telephone.length !== 10) {
            setMsgModal({
                show: true,
                title: "Format Invalide",
                message: "Le numéro de téléphone doit comporter exactement 10 chiffres.",
                type: "error"
            });
            return;
        }

        try {
            const userId = user.id || user._id;
            await axios.put(`/api/livreurs/${userId}`, formData);
            
            // Mise à jour locale
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
            setUser({ ...user, ...formData });
            setIsEditing(false);

            setMsgModal({
                show: true,
                title: "Succès",
                message: "Vos informations de profil ont été mises à jour.",
                type: "success"
            });
        } catch (err) {
            setMsgModal({
                show: true,
                title: "Échec",
                message: "Impossible de modifier le profil. L'email est peut-être déjà utilisé.",
                type: "error"
            });
        }
    };

    if (loading || !user) return null;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar role={user.role} />

            <div className="flex-1 ml-64 flex flex-col text-left">
                <TopBar />

                <main className="p-12">
                    <header className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Mon Profil</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 italic">Livreur Officiel TinDelivery</p>
                        </div>
                        
                        <div>
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-xs uppercase">Annuler</button>
                                    <button onClick={handleSave} className="bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-cyan-700 shadow-lg transition-all text-xs uppercase shadow-cyan-100">Sauvegarder</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="bg-[#013c58] text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest shadow-xl">
                                    <i className="bi bi-pencil-square mr-2"></i> Éditer mes informations
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* CARTE INFOS PERSONNELLES */}
                        <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                                <div className="w-24 h-24 rounded-[28px] bg-[#013c58] text-white flex items-center justify-center text-3xl font-black shadow-lg uppercase">
                                    {user.nomComplet?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{user.nomComplet}</h2>
                                    <span className="inline-block mt-1 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                                        Compte {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField label="Nom Complet" value={formData.nomComplet} isEditing={isEditing} onChange={(val) => setFormData({...formData, nomComplet: val})} icon="bi-person" />
                                <ProfileField label="Email" value={formData.email} isEditing={isEditing} onChange={(val) => setFormData({...formData, email: val})} icon="bi-envelope" />
                                <ProfileField label="Téléphone" value={formData.telephone} isEditing={isEditing} onChange={(val) => setFormData({...formData, telephone: val.replace(/\D/g, "").slice(0, 10)})} icon="bi-telephone" />
                                <ProfileField label="Adresse" value={formData.adresse} isEditing={isEditing} onChange={(val) => setFormData({...formData, adresse: val})} icon="bi-geo-alt" />
                            </div>
                        </div>

                        {/* CARTE STATUT DE SERVICE (SANS ID) */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 text-left">Paramètres de service</p>
                                
                                {/* 1. DISPONIBILITÉ */}
                                <StaticInfo 
                                    label="Disponibilité actuelle" 
                                    value={user.disponibilite ? "✓ DISPONIBLE" : "✗ EN COURSE"} 
                                    color={user.disponibilite ? "text-emerald-500" : "text-orange-500"} 
                                />
                                
                                <div className="h-6"></div>

                                {/* 2. STATUT DU COMPTE */}
                                <StaticInfo 
                                    label="Statut du compte" 
                                    value={user.status?.toUpperCase() || 'ACTIF'} 
                                    color={user.status === 'actif' ? "text-blue-600" : "text-rose-500"}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <MessageModal isOpen={msgModal.show} onClose={() => setMsgModal({ ...msgModal, show: false })} title={msgModal.title} message={msgModal.message} type={msgModal.type} />
        </div>
    );
};

// COMPOSANTS INTERNES UTILITAIRES
const ProfileField = ({ label, value, isEditing, onChange, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 ml-1"><i className={icon}></i> {label}</label>
        {isEditing ? (
            <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <p className="text-sm font-bold text-slate-700 p-4 bg-slate-50/50 rounded-2xl border border-transparent">{value || '---'}</p>
        )}
    </div>
);

const StaticInfo = ({ label, value, color = "text-slate-700" }) => (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">{label}</p>
        <p className={`text-sm font-bold uppercase tracking-tight ${color}`}>{value}</p>
    </div>
);

export default Profile;