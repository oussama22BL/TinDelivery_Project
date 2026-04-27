const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS


// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('API Gestion de Location fonctionne correctement.');
});

// Fonction d'initialisation du serveur
const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDB();

    // Démarrage du serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur :', error.message);
    process.exit(1);
  }
};

startServer();

// chercher les livreurs par nom
const livreurRoutes = require('./routes/livreurRoutes'); 
app.use('/api/livreurs', livreurRoutes);