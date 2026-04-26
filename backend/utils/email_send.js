// utils/email.js

const buildWelcomeEmailHTML = ({ nomComplet, email, plainPassword }) => {
  const loginUrl = process.env.LIVREUR_LOGIN_URL ?? 'https://app.tindelivery.com/login';
  const year = new Date().getFullYear();

  return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Bienvenue chez TinDelivery</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
            <tr><td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                    style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;
                            overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                <!-- HEADER -->
                <tr>
                <td style="background:linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%);
                            padding:36px 40px;text-align:center;">
                    <div style="font-size:36px;margin-bottom:8px;">🚀</div>
                    <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                    Bienvenue, ${nomComplet} !
                    </h1>
                    <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">
                    Votre compte livreur TinDelivery est prêt
                    </p>
                </td>
                </tr>

                <!-- BODY -->
                <tr>
                <td style="padding:36px 40px;">
                    <p style="font-size:16px;color:#374151;margin:0 0 16px;">Bonjour ${nomComplet},</p>
                    <p style="font-size:15px;color:#6b7280;margin:0 0 28px;line-height:1.7;">
                    Votre compte a été créé avec succès. Vous trouverez ci-dessous vos identifiants
                    personnels pour accéder à votre espace livreur.
                    </p>

                    <!-- CREDENTIALS BOX -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                        style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;
                                border-left:4px solid #2563eb;margin-bottom:32px;">
                    <tr>
                        <td style="padding:24px 28px;">
                        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;
                                    letter-spacing:1px;color:#94a3b8;font-weight:600;">Adresse e-mail</p>
                        <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#0f172a;">${email}</p>
                        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;
                                    letter-spacing:1px;color:#94a3b8;font-weight:600;">Mot de passe provisoire</p>
                        <p style="margin:0;font-size:17px;font-weight:700;color:#0f172a;
                                    font-family:'Courier New',monospace;letter-spacing:2px;">${plainPassword}</p>
                        </td>
                    </tr>
                    </table>

                    <!-- CTA -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                        <a href="${loginUrl}"
                            style="display:inline-block;background:#2563eb;color:#ffffff;
                                    padding:14px 36px;border-radius:8px;font-weight:700;
                                    font-size:15px;text-decoration:none;letter-spacing:0.3px;">
                            Se connecter à mon espace →
                        </a>
                        </td>
                    </tr>
                    </table>

                    <!-- SECURITY NOTE -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                        style="margin-top:28px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
                    <tr>
                        <td style="padding:14px 18px;font-size:13px;color:#92400e;">
                        🔒 <strong>Sécurité :</strong> Changez ce mot de passe dès votre première connexion.
                        Ne le partagez avec personne.
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">
                    © ${year} TinDelivery. Tous droits réservés.<br/>
                    Des questions ? <a href="mailto:support@tindelivery.com"
                        style="color:#2563eb;text-decoration:none;font-weight:600;">support@tindelivery.com</a>
                    </p>
                </td>
                </tr>

            </table>
            </td></tr>
        </table>
        </body>
    </html>`;
};

/**
 * Envoi fire-and-forget : ne bloque PAS la réponse HTTP.
 * Les erreurs sont loguées sans crasher la requête.
 */
const sendWelcomeEmailAsync = (transporter, { nomComplet, email, plainPassword }) => {
  transporter
    .sendMail({
      from: `"TinDelivery" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🚀 Bienvenue chez TinDelivery – Vos identifiants de connexion',
      html: buildWelcomeEmailHTML({ nomComplet, email, plainPassword }),
      text: `Bonjour ${nomComplet},\n\nEmail : ${email}\nMot de passe : ${plainPassword}\n\nConnectez-vous : ${process.env.LIVREUR_LOGIN_URL ?? 'https://app.tindelivery.com/login'}\n\n© ${new Date().getFullYear()} TinDelivery`,
    })
    .then(() => console.log(`📧 Email envoyé → ${email}`))
    .catch((err) => console.error(`❌ Échec email pour ${email} :`, err.message));
  // Pas de `await` intentionnel : fire-and-forget
};

module.exports = { sendWelcomeEmailAsync };