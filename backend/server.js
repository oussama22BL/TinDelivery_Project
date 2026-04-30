/**
 * Serveur backend TinDelivery
 * API REST pour la gestion des livraisons
 * 
 * Variables d'environnement requises:
 *   - MONGO_URL: URL de connexion MongoDB
 *   - PORT: Port du serveur (défaut: 5000)
 *   - EMAIL_*: Configuration email (voir config/email.js)
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Configuration DNS (améliore la résolution sur certains systèmes)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES DE TEST ============
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 API TinDelivery fonctionne correctement.',
    version: '1.0.0',
    endpoints: {
      livreurs: '/api/livreurs',
    },
  });
});

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============ API ROUTES ============
app.use('/api/livreurs', require('./routes/livreurRoutes'));

// ============ GESTION DES ERREURS 404 ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.path,
  });
});

// ============ FONCTION DE DÉMARRAGE ============
/**
 * Démarre le serveur Express et se connecte à la base de données
 */
const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDB();

    // Démarrage du serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Serveur en cours d'exécution sur le port ${PORT}`);
      console.log(`📝 Voir la documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur :', error.message);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();
startServer();

// chercher les livreurs par nom
const livreurRoutes = require('./routes/livreurRoutes'); 
app.use('/api/livreurs', livreurRoutes);
