import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GererLivreurs from './pages/AdminPages/GererLivreurs'; // Vérifie bien le chemin !

function App() {
  return (
    <Router>
      <Routes>
        {/* Cette ligne est celle qui permet d'afficher ta page */}
        <Route path="/admin/livreurs" element={<GererLivreurs />} />
        
        {/* Tu peux ajouter une route par défaut pour tester */}
        <Route path="/" element={<h1>Bienvenue sur TinDelivery</h1>} />
      </Routes>
    </Router>
  );
}

export default App;