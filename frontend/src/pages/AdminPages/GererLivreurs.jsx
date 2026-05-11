import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import LivreurForm from '../../components/AdminComponent/LivreurForm';

const GererLivreurs = () => {
    const [livreurs, setLivreurs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statutFilter, setStatutFilter] = useState("all");
    const [disponibiliteFilter, setDisponibiliteFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [editingLivreur, setEditingLivreur] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const refreshList = async () => {
        try {
            const res = await axios.get('/api/livreurs');
            setLivreurs(res.data.data || []);
        } catch (err) {
            console.error("Erreur récupération livreurs:", err);
        }
    };

    useEffect(() => {
        refreshList();
    }, []);

    // Filtrage
    const filteredLivreurs = livreurs.filter(livreur => {
        const matchSearch = livreur.nomComplet.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut = statutFilter === "all" || livreur.status === statutFilter.toLowerCase();
        const matchDisponibilite = disponibiliteFilter === "all" || 
            (disponibiliteFilter === "disponible" && livreur.disponibilite) ||
            (disponibiliteFilter === "non-disponible" && !livreur.disponibilite);
        return matchSearch && matchStatut && matchDisponibilite;
    });

    // Statistiques
    const stats = {
        total: livreurs.length,
        enService: livreurs.filter(l => l.status === 'actif').length,
        disponibles: livreurs.filter(l => l.disponibilite).length,
        inactifs: livreurs.filter(l => l.status === 'inactif').length,
    };

    const getInitials = (nom) => {
        const parts = nom.split(' ');
        return parts.length > 1 
            ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
            : nom.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (nom) => {
        const colors = [
            "bg-blue-100 text-blue-700",
            "bg-emerald-100 text-emerald-700",
            "bg-amber-100 text-amber-700",
            "bg-rose-100 text-rose-700",
            "bg-purple-100 text-purple-700",
            "bg-cyan-100 text-cyan-700"
        ];
        const index = nom.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const toggleStatus = async (livreur) => {
        try {
            await axios.patch(`/api/livreurs/${livreur._id}/status`);
            refreshList();
        } catch (err) {
            console.error("Erreur toggle statut:", err.response?.data);
            alert(err.response?.data?.error || "Erreur lors du changement de statut");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement ce livreur ?")) {
            try {
                await axios.delete(`/api/livreurs/${id}`);
                alert("Livreur supprimé avec succès");
                refreshList();
            } catch (err) {
                console.error("Erreur suppression:", err.response?.data);
                alert(err.response?.data?.error || "Erreur lors de la suppression");
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
             <Sidebar role="admin" />

            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative flex-1">
                            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un livreur, un colis..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <i className="bi bi-gear w-5 h-5"></i>
                        </button>
                        <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            AD
                        </Link>
                    </div>
                </header>

                {/* Contenu principal */}
                <main className="p-8">
                    {/* Titre et bouton */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-1">Gestion des livreurs</h1>
                            <p className="text-slate-500">Suivez et gérez votre flotte logistique en temps réel.</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingLivreur(null);
                            }}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                        >
                            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-person-plus-fill'}`}></i>
                            {showForm ? 'Fermer' : 'Créer un livreur'}
                        </button>
                    </div>

                    {/* Cartes statistiques */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <StatCard label="Total Livreurs" value={stats.total} icon="bi-people-fill" color="text-slate-600" />
                        <StatCard label="En Service" value={stats.enService} icon="bi-truck" color="text-blue-600" />
                        <StatCard label="Disponibles" value={stats.disponibles} icon="bi-check-circle-fill" color="text-emerald-600" />
                        <StatCard label="Inactifs" value={stats.inactifs} icon="bi-x-circle-fill" color="text-red-500" />
                    </div>

                    {showForm && (
                        <div className="mb-10 animate-in fade-in zoom-in duration-300">
                            <LivreurForm
                                refreshList={refreshList}
                                editingLivreur={editingLivreur}
                                setEditingLivreur={setEditingLivreur}
                                setShowForm={setShowForm}
                            />
                        </div>
                    )}

                    {/* Filtres */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <select
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                                value={statutFilter}
                                onChange={(e) => setStatutFilter(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                            </select>
                            <select
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                                value={disponibiliteFilter}
                                onChange={(e) => setDisponibiliteFilter(e.target.value)}
                            >
                                <option value="all">Toute disponibilité</option>
                                <option value="disponible">Disponible</option>
                                <option value="non-disponible">Non disponible</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-700 font-medium text-sm transition-colors">
                            <i className="bi bi-sliders text-sm"></i>
                            Filtres avancés
                        </button>
                    </div>

                    {/* Tableau */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nom</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Disponibilité</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Téléphone</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLivreurs.map((livreur) => (
                                    <tr key={livreur._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColor(livreur.nomComplet)}`}>
                                                    {getInitials(livreur.nomComplet)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{livreur.nomComplet}</p>
                                                    <p className="text-xs text-slate-400">ID: TD-{livreur._id.slice(-5).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {livreur.disponibilite ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    DISPONIBLE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                                                    NON DISPONIBLE
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">{livreur.email}</td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">{livreur.telephone}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(livreur)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${
                                                    livreur.status === 'actif'
                                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                }`}
                                            >
                                                {livreur.status === 'actif' ? 'ACTIF' : 'INACTIF'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingLivreur(livreur);
                                                        setShowForm(true);
                                                    }}
                                                    className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(livreur._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
                            <p className="text-sm text-slate-500">
                                Affichage de {filteredLivreurs.length} sur {stats.total} livreurs
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50">
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button className="w-8 h-8 rounded-lg text-sm font-medium bg-slate-800 text-white">1</button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg">
                <i className={`bi ${icon} w-5 h-5 ${color}`}></i>
            </div>
            <span className="text-slate-500 font-medium text-sm">{label}</span>
        </div>
        <p className="text-4xl font-bold text-slate-800">{value}</p>
    </div>
);

export default GererLivreurs;