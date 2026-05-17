import React, { useState } from 'react';
import axios from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MessageModal from '../components/AdminComponent/MessageModal';

// 1. ICÔNES GÉOGRAPHIQUES (Liens stables)
const colisIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const agenceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const ClientDashboard = () => {
    const [code, setCode] = useState("");
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msgModal, setMsgModal] = useState({ show: false, title: '', message: '' });

    const agenceCoords = [31.5147, -5.5323]; // Tinghir

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/colis/track/${code}`);
            if (res.data) {
                setTrackingData(res.data);
            }
        } catch (err) {
            setTrackingData(null);
            setMsgModal({ show: true, title: "Code Introuvable", message: "Ce code de suivi n'existe pas." });
        } finally { setLoading(false); }
    };

    // --- LOGIQUE CALCULÉE DE L'HISTORIQUE ---
    const getSteps = (status) => {
        return [
            { 
                status: "EXPÉDITION RAMASSÉE", 
                location: "ENTREPÔT TINDELIVERY", 
                done: true // Toujours complété
            },
            { 
                status: "EN TRANSIT", 
                location: "CENTRE DE TRI LOCAL", 
                done: (status === 'en cours' || status === 'livré' || status === 'annulé') 
            },
            { 
                status: "LIVRAISON PRÉVUE", 
                location: "DESTINATION FINALE", 
                done: (status === 'livré' || status === 'annulé') 
            }
        ];
    };

    return (
        <div className="h-screen flex flex-col bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden text-left">
            
            {/* Header */}
            <nav className="h-[70px] flex items-center justify-between px-10 bg-white border-b border-slate-200 shrink-0">
                <div className="text-xl font-black text-[#013c58] tracking-tighter flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#013c58] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">TD</div>
                    TinDelivery Tinghir
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700 border-b-2 border-cyan-700">Suivi en ligne</div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200"><i className="bi bi-person-fill"></i></div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
                <div className="text-center mb-6 shrink-0">
                    <h1 className="text-4xl font-black text-[#013c58] mb-1 tracking-tighter uppercase">Suivi de votre colis</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest opacity-80 italic">Localisation GPS en temps réel</p>
                </div>

                {/* Recherche */}
                <form onSubmit={handleTrack} className="w-full max-w-xl flex gap-3 bg-white p-2 rounded-[1.5rem] shadow-xl border border-slate-200 mb-8 shrink-0">
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <i className="bi bi-search text-slate-400"></i>
                        <input type="text" placeholder="CODE DE SUIVI..." className="w-full outline-none font-black text-slate-800 bg-transparent py-1 uppercase text-xs" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                    </div>
                    <button type="submit" disabled={loading} className="bg-[#013c58] text-white px-8 py-2.5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg">{loading ? "..." : "Suivre"}</button>
                </form>

                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
                    
                    {/* GAUCHE : Statut & Timeline dynamique */}
                    <div className="lg:col-span-4 flex flex-col gap-5 overflow-hidden">
                        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Statut actuel</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg ${trackingData ? 'bg-[#013c58] text-white' : 'bg-slate-50 text-slate-300'}`}>
                                    <i className={trackingData?.colis?.status === 'livrée' ? "bi bi-check-lg" : "bi bi-truck"}></i>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm uppercase leading-tight">{trackingData ? trackingData.colis.status : "Attente"}</h3>
                                    <p className="text-[9px] font-black text-cyan-600 uppercase">Mis à jour</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex-1 overflow-y-auto">
                            <h4 className="text-[9px] font-black text-slate-800 mb-5 uppercase tracking-[0.2em]">Historique</h4>
                            {trackingData ? (
                                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-100">
                                    {getSteps(trackingData.colis.status).map((step, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${step.done ? 'bg-cyan-600' : 'bg-slate-100'}`}>
                                                {step.done && <i className="bi bi-check text-white text-[8px]"></i>}
                                            </div>
                                            <div className={step.done ? 'opacity-100' : 'opacity-20'}>
                                                <p className="text-[11px] font-black text-slate-800 uppercase leading-none">{step.status}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{step.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-10"><i className="bi bi-clock-history text-3xl mb-1"></i><p className="text-[8px] font-black uppercase">Vide</p></div>
                            )}
                        </div>
                    </div>

                    {/* DROITE : Carte */}
                    <div className="lg:col-span-8 flex flex-col gap-5 overflow-hidden">
                        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm h-[320px] relative overflow-hidden z-0">
                            <MapContainer 
                                key={trackingData?.colis?._id || 'initial'}
                                center={trackingData?.position ? [trackingData.position.latitude, trackingData.position.longitude] : agenceCoords} 
                                zoom={14} 
                                style={{ height: '100%', width: '100%', borderRadius: '1.8rem' }}
                                zoomControl={false}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={agenceCoords} icon={agenceIcon} />
                                {trackingData?.position && (
                                    <Marker position={[trackingData.position.latitude, trackingData.position.longitude]} icon={colisIcon}>
                                        <Popup><span className="font-bold text-[10px] uppercase">{trackingData.position.libelleEtape}</span></Popup>
                                    </Marker>
                                )}
                            </MapContainer>

                            {trackingData && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-3 rounded-2xl flex items-center gap-4 border border-slate-200 shadow-2xl w-[70%] z-[1000]">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-white text-xs uppercase">
                                        {trackingData.livraison?.idLivreur?.nomComplet?.substring(0, 2) || "AG"}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-[7px] font-black text-slate-500 uppercase">Livreur assigné</p>
                                        <p className="font-black text-slate-900 text-xs">{trackingData.livraison?.idLivreur?.nomComplet || "Agent"}</p>
                                    </div>
                                    <i className="bi bi-chat-dots-fill text-cyan-600 text-lg"></i>
                                </div>
                            )}
                        </div>

                        {/* Boxes */}
                        <div className="grid grid-cols-2 gap-5 shrink-0">
                            <div className="bg-white p-6 rounded-[1.8rem] border border-slate-200 shadow-sm flex justify-between items-center text-slate-900">
                                <div><p className="text-[8px] font-black text-slate-500 uppercase mb-1">Poids total</p><p className="text-xl font-black">{trackingData ? trackingData.colis.poids : "--"} <span className="text-sm opacity-40">kg</span></p></div>
                                <i className="bi bi-box-seam text-2xl text-slate-200"></i>
                            </div>
                            <div className="bg-[#013c58] p-6 rounded-[1.8rem] shadow-xl flex justify-between items-center text-white">
                                <div><p className="text-[8px] font-black opacity-50 uppercase mb-1">Type Service</p><p className="text-xl font-black">{trackingData ? "Standard" : "--"}</p></div>
                                <i className="bi bi-lightning-charge-fill text-2xl text-white/20"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-[60px] bg-white border-t border-slate-200 shrink-0">
                <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-10">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.1em]">© 2024 TinDelivery Terminal.</p>
                    <div className="flex gap-8 text-[9px] font-black uppercase text-slate-900"><a href="#">Légal</a><a href="#">Support</a></div>
                </div>
            </footer>
            <MessageModal isOpen={msgModal.show} onClose={() => setMsgModal({ ...msgModal, show: false })} title={msgModal.title} message={msgModal.message} type="error" />
        </div>
    );
};

export default ClientDashboard;