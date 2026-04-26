// models/Colis.js
const mongoose = require('mongoose');

const colisSchema = new mongoose.Schema({
  poids: {
    type: Number,
    required: [true, 'Le poids est requis'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['en attente', 'en cours', 'livré', 'annulé'],
    default: 'en attente',
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  dateLivraison: {
    type: Date,
    // non obligatoire à la création
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Colis', colisSchema);