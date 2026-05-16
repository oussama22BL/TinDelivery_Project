import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// RÉUTILISATION DES COMPOSANTS (Architecture Pro)
import Sidebar from './Sidebar'; 
import TopBar from './TopBar'; 
import MessageModal from '../components/AdminComponent/MessageModal';

const Profile = () => {
    const navigate = useNavigate();
    
    // États pour la gestion des données
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    // État pour les messages de retour (Erreur/Succès)
    const [msgModal, setMsgModal] = useState({ show: false, title: '', message: '', type: 'error' });

    // 1. Chargement initial des données
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            navigate('/connexion'); 
        } else {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // On initialise le formulaire avec un champ motDePasse vide
            setFormData({ ...parsedUser, motDePasse: '' });
            setLoading(false);
        }
    }, [navigate]);

    // 2. Logique de sauvegarde avec validations
    const handleSave = async (e) => {
        e.preventDefault();

        // VALIDATION : Téléphone (Exactement 10 chiffres)
        if (formData.telephone.length !== 10) {
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
            
            // Préparation des données (on n'envoie pas le MDP s'il est vide)
            const dataToSend = { ...formData };
            if (!dataToSend.motDePasse) delete dataToSend.motDePasse;

            // Appel API vers la route PUT (modifiée selon tes routes)
            await axios.put(`/api/livreurs/${userId}`, dataToSend);
            
            // Mise à jour locale (LocalStorage + État)
            const updatedUser = { ...user, ...formData };
            delete updatedUser.motDePasse; // Sécurité : pas de MDP en clair en local
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);

            setMsgModal({
                show: true,
                title: "Profil mis à jour",
                message: "Vos modifications et vos nouveaux accès ont été enregistrés.",
                type: "success"
            });

        } catch (err) {
            setMsgModal({
                show: true,
                title: "Échec",
                message: "Impossible de mettre à jour le profil. Vérifiez si l'email n'est pas déjà pris.",
                type: "error"
            });
        }
    };

    if (loading || !user) return null;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Navigation latérale */}
            <Sidebar role={user.role} />

            <div className="flex-1 ml-64 flex flex-col">
                {/* Navigation haute */}
                <TopBar />

                <main className="p-12 text-left">
                    <header className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Mon Profil</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 italic">
                                {user.role === 'admin' ? 'Contrôle Administrateur' : 'Livreur Tinghir Certifié'}
                            </p>
                        </div>
                        
                        <div>
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-xs uppercase">Annuler</button>
                                    <button onClick={handleSave} className="bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-cyan-700 shadow-lg transition-all text-xs uppercase">Sauvegarder</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="bg-[#013c58] text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest shadow-xl">
                                    <i className="bi bi-pencil-square mr-2"></i> Éditer mes informations
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Section Gauche : Formulaire Personnel */}
                        <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                                <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#013c58] to-slate-800 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                                    {user.nomComplet?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{user.nomComplet}</h2>
                                    <span className="inline-block mt-1 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                                        Agent : {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField label="Nom Complet" value={formData.nomComplet} isEditing={isEditing} onChange={(val) => setFormData({...formData, nomComplet: val})} icon="bi-person" />
                                <ProfileField label="Email Professionnel" value={formData.email} isEditing={isEditing} onChange={(val) => setFormData({...formData, email: val})} icon="bi-envelope" />
                                
                                {/* Champ Téléphone avec filtrage (chiffres uniquement) */}
                                <ProfileField 
                                    label="Téléphone" 
                                    value={formData.telephone} 
                                    isEditing={isEditing} 
                                    onChange={(val) => setFormData({...formData, telephone: val.replace(/\D/g, "").slice(0, 10)})} 
                                    icon="bi-telephone" 
                                />

                                <ProfileField label="Adresse / Ville" value={formData.adresse} isEditing={isEditing} onChange={(val) => setFormData({...formData, adresse: val})} icon="bi-geo-alt" />
                                
                                {isEditing && (
                                    <ProfileField 
                                        label="Nouveau Mot de passe" 
                                        value={formData.motDePasse} 
                                        isEditing={true} 
                                        onChange={(val) => setFormData({...formData, motDePasse: val})} 
                                        icon="bi-lock" 
                                        type="password" 
                                    />
                                )}
                            </div>
                        </div>

                        {/* Section Droite : Statuts Systèmes */}
                        <div className="space-y-6">
                            {user.role === 'livreur' && (
                                <div className="bg-[#013c58] p-8 rounded-[35px] text-white shadow-xl relative overflow-hidden">
                                    <p className="text-[10px] font-bold opacity-60 uppercase mb-6 tracking-widest">Activité</p>
                                    <p className="text-4xl font-black">{user.nombreLivraison || 0}</p>
                                    <p className="text-[10px] opacity-60 uppercase font-bold mt-1">Colis livrés</p>
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full"></div>
                                </div>
                            )}

                            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Paramètres Compte</p>
                                <StaticInfo 
                                    label="Disponibilité" 
                                    value={user.disponibilite ? "✓ DISPONIBLE" : "✗ EN COURSE"} 
                                    color={user.disponibilite ? "text-emerald-500" : "text-orange-500"} 
                                />
                                <div className="h-6"></div>
                                <StaticInfo label="État du compte" value={user.status?.toUpperCase() || 'ACTIF'} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modale de Notification Unique */}
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

// Composant Interne pour les champs
const ProfileField = ({ label, value, isEditing, onChange, icon, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 ml-1"><i className={icon}></i> {label}</label>
        {isEditing ? (
            <input 
                type={type}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder={type === "password" ? "Vider pour ne pas changer" : ""}
            />
        ) : (
            <p className="text-sm font-bold text-slate-700 p-4 bg-slate-50/50 rounded-2xl border border-transparent">{value || '---'}</p>
        )}
    </div>
);

// Composant Interne pour les infos fixes
const StaticInfo = ({ label, value, color = "text-slate-700" }) => (
    <div>
        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">{label}</p>
        <p className={`text-sm font-bold uppercase tracking-tight ${color}`}>{value}</p>
    </div>
);

export default Profile;