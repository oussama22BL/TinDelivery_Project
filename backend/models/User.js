// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nomComplet: {
    type: String,
    required: [true, 'Le nom complet est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Email invalide'],
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
  },
  adresse: {
    type: String,
    required: [true, "L'adresse est requise"],
  },
  role: {
    type: String,
    enum: ['admin', 'livreur'],   // strictement les deux rôles du diagramme
    default: 'livreur',
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false,
  },
  // Champs spécifiques au Livreur
  status: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif',
  },
  disponibilite: {
    type: Boolean,
    default: true,
  },
  nombreLivraison: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);