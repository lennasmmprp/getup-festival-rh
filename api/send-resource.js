// Fonction serverless Vercel — reçoit le formulaire "Recevoir ma ressource"
// et envoie un email personnalisé au visiteur, via Gmail SMTP.
//
// Nécessite deux variables d'environnement, à définir dans Vercel
// (Project Settings → Environment Variables) — jamais dans le code :
// - GMAIL_USER : le compte Gmail utilisé pour l'envoi (ex. lenna.smm.pro@gmail.com)
// - GMAIL_APP_PASSWORD : un mot de passe d'application généré sur ce compte
//   (nécessite la validation en 2 étapes activée sur le compte Google)
//
// Pour que l'email parte avec lenna@getupprod.fr comme expéditeur visible
// (FROM_EMAIL ci-dessous) plutôt que l'adresse Gmail brute, cette adresse
// doit être ajoutée et validée dans les paramètres Gmail du compte
// GMAIL_USER : Paramètres → Comptes et importation → "Envoyer des emails
// en tant que" → Ajouter une adresse. Sans cette étape, Gmail retombe sur
// l'adresse GMAIL_USER comme expéditeur réel.
const nodemailer = require('nodemailer');
const { getFormationById } = require('../assets/formations-data.js');

const NOTIFY_EMAIL = 'lenna.smm.pro@gmail.com';
// Un email n'a pas de "page courante" : un lien commençant par "/" (comme
// formation.ressourceUrl) ne peut pas s'y résoudre tout seul. On le préfixe
// donc toujours avec le domaine complet du site avant de l'insérer dans l'email.
const SITE_URL = 'https://getupskills.vercel.app';
const FROM_EMAIL = 'Get Up Skills <lenna@getupprod.fr>';

function resolveResourceUrl(url) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : SITE_URL + url;
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  return transporter;
}

async function sendEmail(payload) {
  try {
    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: payload.to,
      replyTo: payload.reply_to,
      subject: payload.subject,
      html: payload.html
    });
  } catch (err) {
    throw new Error('Gmail SMTP a refusé l\'envoi : ' + (err && err.message ? err.message : err));
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('GMAIL_USER / GMAIL_APP_PASSWORD manquantes : configurez-les dans Vercel.');
    return res.status(500).json({ error: "Le service d'envoi n'est pas configuré." });
  }

  const body = req.body || {};
  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const company = (body.company || '').trim();
  const formationId = (body.formation || '').trim();
  const consent = !!body.consent;

  // Anti-spam : champ piège invisible (les bots le remplissent, jamais un humain)
  // + délai minimum de remplissage (un envoi en moins de 3s trahit un script).
  // On répond un faux succès plutôt qu'une erreur, pour ne pas indiquer au bot
  // ce qui a été détecté.
  const honeypotFilled = !!(body.website || '').trim();
  const loadedAt = Number(body.formLoadedAt) || 0;
  const submittedTooFast = loadedAt > 0 && Date.now() - loadedAt < 3000;
  if (honeypotFilled || submittedTooFast) {
    console.warn('Soumission bloquée (anti-spam) :', { honeypotFilled, submittedTooFast, email });
    return res.status(200).json({ ok: true });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!firstName || !lastName || !email || !emailPattern.test(email) || !consent) {
    return res.status(400).json({ error: 'Champs manquants ou invalides.' });
  }

  const formation = getFormationById(formationId);
  // "Vraie" ressource = un fichier réellement hébergé sur le site
  // (/ressources/...). formation.ressourceNom seul ne suffit pas : "ia" en a
  // un, mais c'est un placeholder de test (cataas.com), pas un vrai lead
  // magnet — même logique que côté front (formations.html, recevoir-ma-ressource).
  const hasRealResource = !!(formation && formation.ressourceUrl && formation.ressourceUrl.indexOf('/ressources/') === 0);

  const introText = formation
    ? (hasRealResource
        ? 'Merci ' + escapeHtml(firstName) + ' ! Comme promis, votre ressource sur « ' + escapeHtml(formation.title) + ' » est prête.'
        : formation.ressourceDate
          ? 'Merci, votre demande pour la ressource « ' + escapeHtml(formation.title) + ' » a bien été enregistrée.<br>Le guide sort le ' + escapeHtml(formation.ressourceDate) + ' : vous serez parmi les premiers à le recevoir.'
          : 'Merci ' + escapeHtml(firstName) + ', votre demande pour « ' + escapeHtml(formation.title) + ' » a bien été enregistrée. Votre ressource est en cours de finalisation : elle sera prête le <strong>lundi 26 octobre 2026</strong>. Nous vous l\'enverrons par e-mail dès sa sortie.')
    : 'Merci pour votre demande. Notre équipe revient vers vous rapidement avec les informations adaptées à votre besoin.';

  // Carte ressource mise en avant, uniquement quand une vraie ressource existe.
  const resourceCardHtml = hasRealResource
    ? '<tr><td style="padding:4px 0 8px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4fb;border:1px solid #dde6f7;border-radius:12px;">' +
      '<tr><td style="padding:28px 28px 24px;">' +
      '<span style="display:inline-block;background:#FFF2B2;color:#0D419A;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;border-radius:999px;margin-bottom:14px;">Votre ressource</span><br>' +
      '<span style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;color:#012460;line-height:1.3;margin-bottom:10px;">' + escapeHtml(formation.ressourceNom) + '</span>' +
      '<span style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a5568;margin-bottom:20px;">' + escapeHtml(formation.objective) + '</span>' +
      '<a href="' + escapeHtml(resolveResourceUrl(formation.ressourceUrl)) + '" style="display:inline-block;background:#0D419A;color:#FFF2B2;padding:14px 30px;border-radius:6px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Télécharger la ressource →</a>' +
      '</td></tr>' +
      '</table>' +
      '</td></tr>'
    : '';

  const visitorHtml =
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f3;padding:40px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">' +

    // Accent haut
    '<tr><td bgcolor="#FFF2B2" style="background:#FFF2B2;height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>' +

    // Bandeau bleu
    '<tr><td bgcolor="#0D419A" style="background:#0D419A;padding:32px 40px;text-align:center;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;color:#FFF2B2;letter-spacing:1px;text-transform:uppercase;">Get Up Skills</span><br>' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#92aad2;letter-spacing:0.5px;">Formations par l\'improvisation théâtrale</span>' +
    '</td></tr>' +

    // Corps
    '<tr><td style="padding:36px 40px 8px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td style="padding-bottom:16px;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:800;color:#012460;">Bonjour' + (firstName ? ' ' + escapeHtml(firstName) : '') + ',</span>' +
    '</td></tr>' +
    '<tr><td style="padding-bottom:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#333333;">' + introText + '</td></tr>' +
    resourceCardHtml +
    '<tr><td style="padding:24px 0 8px;border-top:1px solid #f0f0f0;margin-top:8px;">' +
    '<span style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#333333;margin-bottom:12px;">Envie d\'aller plus loin ?</span>' +
    '<a href="https://calendly.com/laurie-benatte-getupprod/30min" style="display:inline-block;background:#ffffff;color:#0D419A;padding:12px 24px;border-radius:6px;border:1.5px solid #0D419A;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.3px;">Réserver un appel de 20 min →</a>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +

    // Footer
    '<tr><td style="background:#f8f7f3;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;">Get Up Skills — vous recevez cet email suite à votre demande sur notre site.</span>' +
    '</td></tr>' +

    '</table>' +
    '</td></tr>' +
    '</table>';

  const notifyHtml =
    '<div style="font-family:sans-serif;line-height:1.6;">' +
    '<p><strong>Nouvelle demande de ressource</strong></p>' +
    '<ul>' +
    '<li>Nom : ' + escapeHtml(firstName) + ' ' + escapeHtml(lastName) + '</li>' +
    '<li>Email : ' + escapeHtml(email) + '</li>' +
    '<li>Téléphone : ' + (phone ? escapeHtml(phone) : '—') + '</li>' +
    '<li>Entreprise : ' + (company ? escapeHtml(company) : '—') + '</li>' +
    '<li>Formation : ' + (formation ? escapeHtml(formation.title) : '(non identifiée : ' + escapeHtml(formationId) + ')') + '</li>' +
    '<li>Type : ' + (formation ? (hasRealResource ? 'Ressource envoyée' : 'Demande enregistrée (ressource pas encore prête)') : '—') + '</li>' +
    '</ul>' +
    '</div>';

  try {
    await sendEmail({
      to: [email],
      subject: formation
        ? (hasRealResource ? 'Votre ressource — ' + formation.title : 'Votre demande bien reçue — ' + formation.title)
        : 'Votre demande — Get Up Skills',
      html: visitorHtml
    });

    await sendEmail({
      to: [NOTIFY_EMAIL],
      reply_to: email,
      subject: 'Nouveau lead — ' + firstName + ' ' + lastName,
      html: notifyHtml
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi email :', err);
    return res.status(502).json({ error: "L'envoi de l'email a échoué." });
  }
};
