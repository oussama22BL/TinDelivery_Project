import React, { useState } from 'react';
import axios from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. DÉFINITION DES ICÔNES PERSONNALISÉES
/// Icône pour le Colis (Marqueur GPS Bleu)
const colisIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});

// Icône pour l'Agence (CAMION - Style Amana/Transport)
const agenceIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Vraie icône de camion
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const ClientDashboard = () => {
    const [code, setCode] = useState("");
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Coordonnées de l'agence principale à Tinghir
    const agenceCoords = [31.5147, -5.5323];

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!code) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/colis/track/${code}`);
            setTrackingData(res.data);
        } catch (err) {
            setError("Code incorrect.");
        } finally { setLoading(false); }
    };

    return (
        <div className="h-screen flex flex-col bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden">
            {/* Header */}
            <nav className="h-[70px] flex items-center justify-between px-10 bg-white border-b border-slate-200 shrink-0">
                <div className="text-xl font-black text-[#013c58] tracking-tighter flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#013c58] rounded-lg flex items-center justify-center text-white text-xs font-bold">TD</div>
                    TinDelivery Tinghir
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                    <i className="bi bi-person-fill"></i>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
                <form onSubmit={handleTrack} className="w-full max-w-xl flex gap-3 bg-white p-2 rounded-[1.5rem] shadow-xl border border-slate-200 mb-8 shrink-0">
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <i className="bi bi-search text-slate-400"></i>
                        <input type="text" placeholder="ENTREZ CODE SUIVI..." className="w-full outline-none font-black text-slate-800 bg-transparent py-1 uppercase text-xs" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                    </div>
                    <button type="submit" className="bg-[#013c58] text-white px-6 py-2 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                        {loading ? "..." : "Suivre"}
                    </button>
                </form>

                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
                    {/* GAUCHE : Statut & Timeline */}
                    <div className="lg:col-span-4 flex flex-col gap-5 overflow-hidden">
                        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm text-left">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Statut actuel</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${trackingData ? 'bg-[#013c58] text-white' : 'bg-slate-50 text-slate-300'}`}>
                                    <i className="bi bi-truck"></i>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm">{trackingData ? "En mouvement" : "En attente"}</h3>
                                    <p className="text-[9px] font-black text-cyan-600 uppercase">{trackingData ? trackingData.colis.status : "Saisissez un code"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex-1 overflow-y-auto text-left">
                            <h4 className="text-[9px] font-black text-slate-800 mb-5 uppercase tracking-[0.2em]">Parcours du colis</h4>
                            {trackingData ? (
                                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-100">
                                    {trackingData.historique.map((step, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${step.done ? 'bg-cyan-600' : 'bg-slate-100'}`}>
                                                {step.done && <i className="bi bi-check text-white text-[8px]"></i>}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-800 uppercase leading-none">{step.status}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{step.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-20"><i className="bi bi-clock-history text-2xl mb-1"></i><p className="text-[8px] font-black uppercase">Aucun historique</p></div>
                            )}
                        </div>
                    </div>

                    {/* DROITE : CARTE AVEC ICÔNE AGENCE ET COLIS */}
                    <div className="lg:col-span-8 flex flex-col gap-5 overflow-hidden">
                        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm h-[320px] relative overflow-hidden z-0">
                            <MapContainer 
                                center={agenceCoords} 
                                zoom={14} 
                                style={{ height: '100%', width: '100%', borderRadius: '1.8rem' }}
                                zoomControl={false}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                
                                {/* 1. Marqueur de l'Agence (Toujours visible) */}
                                <Marker position={agenceCoords} icon={agenceIcon}>
                                    <Popup>
                                        <div className="text-[10px] font-black uppercase text-[#013c58]">Agence TinDelivery Tinghir</div>
                                        <div className="text-[9px] text-slate-400 font-bold">Centre-Ville, Tinghir</div>
                                    </Popup>
                                </Marker>

                                {/* 2. Marqueur du Colis (Uniquement si trackingData) */}
                                {trackingData?.position && (
                                    <Marker position={[trackingData.position.latitude, trackingData.position.longitude]} icon={colisIcon}>
                                        <Popup>
                                            <div className="text-[10px] font-black uppercase text-cyan-600">Position actuelle du colis</div>
                                            <div className="text-[9px] text-slate-800 font-bold">{trackingData.position.libelleEtape}</div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>

                            {/* Driver Overlay */}
                            {trackingData && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-slate-200 shadow-2xl w-[70%] z-[1000]">
                                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-black text-white text-[10px]">AG</div>
                                    <div className="flex-1 text-left">
                                        <p className="text-[7px] font-black text-slate-400 uppercase">Agent Livreur</p>
                                        <p className="font-black text-slate-800 text-xs">{trackingData.livraison?.idLivreur?.nomComplet || "Agent"}</p>
                                    </div>
                                    <i className="bi bi-chat-dots-fill text-cyan-600 text-base"></i>
                                </div>
                            )}
                        </div>

                        {/* Boxes Poids/Service */}
                        <div className="grid grid-cols-2 gap-5 shrink-0">
                            <div className="bg-white p-5 rounded-[1.8rem] border border-slate-200 shadow-sm flex justify-between items-center text-left">
                                <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Poids total</p><p className="text-xl font-black text-[#013c58]">{trackingData ? trackingData.colis.poids : "--"} <span className="text-xs opacity-40">kg</span></p></div>
                                <i className="bi bi-box-seam text-xl text-slate-200"></i>
                            </div>
                            <div className="bg-[#013c58] p-5 rounded-[1.8rem] shadow-xl flex justify-between items-center text-white text-left text-white">
                                <div><p className="text-[8px] font-black opacity-50 uppercase mb-1 tracking-widest">Type Service</p><p className="text-xl font-black">{trackingData ? "Standard" : "--"}</p></div>
                                <i className="bi bi-lightning-charge-fill text-xl text-white/20"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-[60px] bg-white border-t border-slate-200 shrink-0">
                <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-10">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.1em]">© 2024 TinDelivery Terminal.</p>
                    <div className="flex gap-8 text-[9px] font-black uppercase text-slate-900">
                        <a href="#">Légal</a><a href="#">Confidentialité</a><a href="#">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClientDashboard;