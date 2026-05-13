import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from './Sidebar'; 
import TopBar from './TopBar'; 
import MessageModal from '../components/AdminComponent/MessageModal';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
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
            const userId = user.id || user._id;
            
            // On envoie les données au backend
            const res = await axios.patch(`/api/users/profile/${userId}`, formData);
            
            // Si le serveur répond avec succès
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);

            setMsgModal({
                show: true,
                title: "Profil mis à jour",
                message: "Vos modifications ont été enregistrées avec succès.",
                type: "success"
            });
        } catch (err) {
            // GESTION INTELLIGENTE DE L'ERREUR
            const errorMessage = err.response?.data?.error || "";
            
            if (errorMessage.includes("email") || err.response?.status === 400) {
                setMsgModal({
                    show: true,
                    title: "Attention",
                    message: "Cet email est déjà utilisé par un autre compte. Si vous n'avez pas changé d'email, demandez au développeur Backend de vérifier la règle d'unicité.",
                    type: "error"
                });
            } else {
                setMsgModal({
                    show: true,
                    title: "Erreur technique",
                    message: "Impossible de sauvegarder pour le moment.",
                    type: "error"
                });
            }
        }
    };

    if (loading || !user) return null;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar role={user.role} />
            <div className="flex-1 ml-64 flex flex-col">
                <TopBar />
                <main className="p-12 text-left">
                    <header className="mb-10 flex justify-between items-center text-left">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Mon Profil</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 italic">
                                {user.role === 'admin' ? 'Direction Générale' : 'Livreur Officiel'}
                            </p>
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-xs">Annuler</button>
                                    <button onClick={handleSave} className="bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-cyan-700 shadow-lg transition-all text-xs">Sauvegarder</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="bg-[#013c58] text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest shadow-xl">
                                    <i className="bi bi-pencil-square mr-2"></i> Éditer mes infos
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50 text-left">
                                <div className="w-24 h-24 rounded-[28px] bg-[#013c58] text-white flex items-center justify-center text-3xl font-black shadow-lg">
                                    {user.nomComplet?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{user.nomComplet}</h2>
                                    <span className="inline-block mt-1 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                                        Agent {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <ProfileField label="Nom Complet" value={formData.nomComplet} isEditing={isEditing} onChange={(val) => setFormData({...formData, nomComplet: val})} icon="bi-person" />
                                <ProfileField label="Email" value={formData.email} isEditing={isEditing} onChange={(val) => setFormData({...formData, email: val})} icon="bi-envelope" />
                                <ProfileField label="Téléphone" value={formData.telephone} isEditing={isEditing} onChange={(val) => setFormData({...formData, telephone: val.replace(/\D/g, "")})} icon="bi-telephone" />
                                <ProfileField label="Adresse" value={formData.adresse} isEditing={isEditing} onChange={(val) => setFormData({...formData, adresse: val})} icon="bi-geo-alt" />
                            </div>
                        </div>

                        <div className="space-y-6 text-left">
                            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Informations Système</p>
                                <StaticInfo label="Identifiant Unique" value={`ID-${(user.id || user._id || '---').toString().slice(-6).toUpperCase()}`} />
                                <div className="h-6"></div>
                                <StaticInfo label="État du compte" value={user.status?.toUpperCase() || 'ACTIF'} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <MessageModal isOpen={msgModal.show} onClose={() => setMsgModal({ ...msgModal, show: false })} title={msgModal.title} message={msgModal.message} type={msgModal.type} />
        </div>
    );
};

const ProfileField = ({ label, value, isEditing, onChange, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 ml-1"><i className={icon}></i> {label}</label>
        {isEditing ? (
            <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <p className="text-sm font-bold text-slate-700 p-4 bg-slate-50/50 rounded-2xl border border-transparent">{value || '---'}</p>
        )}
    </div>
);

const StaticInfo = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{value}</p>
    </div>
);

export default Profile;