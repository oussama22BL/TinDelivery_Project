// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,          // ex: smtp.gmail.com
  port: process.env.EMAIL_PORT,          // ex: 587
  secure: false,                         // true pour 465, false pour les autres
  auth: {
    user: process.env.EMAIL_USER,        // ton adresse email
    pass: process.env.EMAIL_PASS,        // mot de passe d'application
  },
});

// Tester la connexion (optionnel)
transporter.verify()
  .then(() => console.log('✅ Prêt à envoyer des emails'))
  .catch((err) => console.error('❌ Erreur configuration email :', err));

module.exports = transporter;