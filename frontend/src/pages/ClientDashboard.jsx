import React, { useState } from 'react';
import axios from '../api/axios';

const ClientDashboard = () => {
    const [code, setCode] = useState("");
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!code) return;
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`/api/colis/track/${code}`);
            setTrackingData(res.data);
        } catch (err) {
            setError("Code introuvable.");
            setTrackingData(null);
        } finally { setLoading(false); }
    };

    return (
        <div className="h-screen flex flex-col bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden">
            
            {/* --- NAVIGATION (Fixe) --- */}
            <nav className="h-[70px] flex items-center justify-between px-10 bg-white border-b border-slate-200 shrink-0">
                <div className="text-xl font-black text-[#013c58] tracking-tighter flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#013c58] rounded-lg flex items-center justify-center">
                        <i className="bi bi-box-seam-fill text-white text-xs"></i>
                    </div>
                    TinDelivery
                </div>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <a href="#" className="text-cyan-700 border-b-2 border-cyan-700">Suivi</a>
                    <a href="#" className="hover:text-black transition-colors">Aide</a>
                    <a href="#" className="hover:text-black transition-colors">Contact</a>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <i className="bi bi-person-fill"></i>
                </div>
            </nav>

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
                
                {/* Hero & Search (Plus compacts) */}
                <div className="text-center mb-6 shrink-0">
                    <h1 className="text-4xl font-black text-[#013c58] mb-1 tracking-tighter">Suivi de votre commande.</h1>
                    <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest opacity-80">
                        Localisez votre colis en temps réel.
                    </p>
                </div>

                <form onSubmit={handleTrack} className="w-full max-w-xl flex gap-3 bg-white p-2 rounded-[1.5rem] shadow-xl border border-slate-200 mb-8 shrink-0">
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <i className="bi bi-search text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="CODE DE SUIVI..."
                            className="w-full outline-none font-black text-slate-800 placeholder:text-slate-300 bg-transparent py-1 uppercase text-xs"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-[#013c58] text-white px-6 py-2.5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                        {loading ? "..." : "Suivre"}
                    </button>
                </form>

                {/* Grille (Dimensions ajustées) */}
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
                    
                    {/* GAUCHE */}
                    <div className="lg:col-span-4 flex flex-col gap-5 overflow-hidden">
                        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm shrink-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Statut</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${trackingData ? 'bg-[#013c58] text-white' : 'bg-slate-50 text-slate-300'}`}>
                                    <i className="bi bi-truck"></i>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm leading-tight">{trackingData ? "Livraison prévue" : "Attente..."}</h3>
                                    <p className="text-[9px] font-black text-cyan-600 uppercase">{trackingData ? trackingData.colis.status : "Entrez un code"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex-1 overflow-y-auto">
                            <h4 className="text-[9px] font-black text-slate-800 mb-5 uppercase tracking-[0.2em]">Historique</h4>
                            {trackingData ? (
                                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-100">
                                    {trackingData.historique.map((step, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${step.done ? 'bg-cyan-600' : 'bg-slate-100'}`}>
                                                {step.done && <i className="bi bi-check text-white text-[8px]"></i>}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-800 uppercase leading-none">{step.status}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-20">
                                    <i className="bi bi-clock-history text-2xl mb-1"></i>
                                    <p className="text-[8px] font-black uppercase">Vide</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DROITE */}
                    <div className="lg:col-span-8 flex flex-col gap-5 overflow-hidden">
                        {/* MAP (HAUTEUR RÉDUITE ICI) */}
                        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm h-[320px] relative overflow-hidden">
                            <div className="w-full h-full rounded-[2rem] bg-[#E9EDF2] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gray-geoma.png')] opacity-30"></div>
                                {trackingData ? (
                                    <>
                                        <div className="w-12 h-12 bg-[#013c58] rounded-full flex items-center justify-center text-white text-xl shadow-2xl border-4 border-white relative z-10 animate-bounce">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-xl w-[70%]">
                                            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-black text-white text-[10px]">TL</div>
                                            <div className="flex-1 text-left">
                                                <p className="text-[7px] font-black text-slate-400 uppercase">Livreur</p>
                                                <p className="font-black text-slate-800 text-xs">{trackingData.livraison?.idLivreur?.nomComplet || "Agent TinDelivery"}</p>
                                            </div>
                                            <i className="bi bi-chat-dots-fill text-cyan-600 text-base"></i>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em]">Attente de géolocalisation</p>
                                )}
                            </div>
                        </div>

                        {/* Boxes Poids/Service */}
                        <div className="grid grid-cols-2 gap-5 shrink-0">
                            <div className="bg-white p-5 rounded-[1.8rem] border border-slate-200 shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Poids</p>
                                    <p className="text-xl font-black text-[#013c58]">{trackingData ? trackingData.colis.poids : "--"} <span className="text-xs opacity-40">kg</span></p>
                                </div>
                                <i className="bi bi-box-seam text-xl text-slate-100"></i>
                            </div>
                            <div className="bg-[#013c58] p-5 rounded-[1.8rem] shadow-xl flex justify-between items-center text-white">
                                <div>
                                    <p className="text-[8px] font-black opacity-50 uppercase mb-1">Service</p>
                                    <p className="text-xl font-black">{trackingData ? "Express" : "--"} <span className="text-xs opacity-40">24h</span></p>
                                </div>
                                <i className="bi bi-lightning-charge-fill text-xl text-white/10"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FOOTER (Largeur contenue et hauteur fixe) --- */}
            <footer className="h-[60px] bg-white border-t border-slate-200 shrink-0">
                <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-6">
                    <p className="text-[9px] font-bold text-slate-800 uppercase tracking-[0.1em]">
                        © 2024 TinDelivery Terminal.
                    </p>
                    <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.05em] text-slate-900">
                        <a href="#" className="hover:text-cyan-600">Mentions légales</a>
                        <a href="#" className="hover:text-cyan-600">Confidentialité</a>
                        <a href="#" className="hover:text-cyan-600">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClientDashboard;