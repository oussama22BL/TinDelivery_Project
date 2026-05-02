import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GererLivreurs from './pages/AdminPages/GererLivreurs';
import GererColis from './pages/AdminPages/GererColis';
import Profile from './components/profile';// Vérifie bien le chemin !

function App() {
  return (
    <Router>
      <Routes>
        {/* Cette ligne est celle qui permet d'afficher ta page */}
        <Route path="/admin/livreurs" element={<GererLivreurs />} />
        
         {/* Route pour Gérer les colis  */}
        <Route path="/admin/colis" element={<GererColis />} />
        
        {/* Tu peux ajouter une route par défaut pour tester */}
        <Route path="/" element={<h1>Bienvenue sur TinDelivery</h1>} />

        {/* NOUVELLE ROUTE POUR LE PROFIL */}
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;