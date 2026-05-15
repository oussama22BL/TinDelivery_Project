import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import ColisForm from '../../components/AdminComponent/ColisForm';
import ColisTable from '../../components/AdminComponent/ColisTable';
import TopBar from '../../components/TopBar';

const GererColis = () => {
  const [colis, setColis] = useState([]);
  const [searchDestinataire, setSearchDestinataire] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingColis, setEditingColis] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  //  Récupérer les colis 
  const refreshList = async () => {
    try {
      const response = await axios.get('/api/colis');

      const data = response.data?.data || [];

      const formatted = Array.isArray(data)
        ? data.map((c) => ({
            id: c._id,
            code: c.codeSuivi,
            poids: c.poids,
  
            statut: c.status?.toUpperCase(),
            dateCreation: new Date(c.createdAt).toLocaleString(),
            expediteur: {
              nom: c.expediteurNomComplet,
              email: c.expediteurEmail,
              telephone: c.expediteurTelephone,
              adresse: c.expediteurAdresse,
            },
            destinataire: {
              nom: c.destinataireNomComplet,
              email: c.destinataireEmail,
              telephone: c.destinataireTelephone,
              adresse: c.destinataireAdresse,
            },
          }))
        : [];

      setColis(formatted);
    } catch (err) {
      console.error("Erreur récupération colis:", err);
      setColis([]);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const safeColis = Array.isArray(colis) ? colis : [];

  //  Filtrage 
  const filteredColis = safeColis.filter(item => {
    
    const matchDestinataire = searchDestinataire === '' || 
      item.destinataire?.nom?.toLowerCase().includes(searchDestinataire.toLowerCase());

    const matchStatut = statutFilter === 'all' || 
      item.statut === statutFilter.toUpperCase();

    return matchDestinataire && matchStatut;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="admin" />

      <div className="flex-1 ml-64">
        <TopBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />

        <main className="p-8">
          {/* Titre et bouton */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Gestion des colis</h1>
              <p className="text-slate-500">Supervisez et gérez les expéditions en temps réel.</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingColis(null);
              }}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg"
            >
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
              {showForm ? 'Fermer' : 'Créer un colis'}
            </button>
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="mb-10">
              <ColisForm
                refreshList={refreshList}
                editingColis={editingColis}
                setEditingColis={setEditingColis}
                setShowForm={setShowForm}
              />
            </div>
          )}

          {/* Barre de recherche + Filtre par statut */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Rechercher par nom du destinataire..."
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchDestinataire}
                onChange={(e) => setSearchDestinataire(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="EN ATTENTE">En attente</option>
              <option value="EN COURS">En cours</option>
              <option value="LIVRÉ">Livré</option>
              <option value="ANNULÉ">Annulé</option>
            </select>
          </div>

          {/* Tableau */}
          <ColisTable
            colis={filteredColis}
            refreshList={refreshList}
            onEdit={setEditingColis}
            setShowForm={setShowForm}
          />

          {/* Info nombre de colis  */}
          <div className="mt-4 text-right text-sm text-slate-500">
            Affichage de {filteredColis.length} sur {colis.length} colis
          </div>
        </main>
      </div>
    </div>
  );
};

export default GererColis;