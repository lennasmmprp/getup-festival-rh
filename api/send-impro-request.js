// Fonction serverless Vercel — reçoit le formulaire "Réserver Impro Club"
// (page impro-club.html) et envoie la demande directement à Laurie, via
// Gmail SMTP (même mécanisme que /api/send-resource.js).
//
// Nécessite les mêmes variables d'environnement Vercel que send-resource.js :
// - GMAIL_USER : le compte Gmail utilisé pour l'envoi (ex. lenna.smm.pro@gmail.com)
// - GMAIL_APP_PASSWORD : mot de passe d'application généré sur ce compte
const nodemailer = require('nodemailer');

// Destinataire volontairement différent de NOTIFY_EMAIL dans send-resource.js :
// les demandes Impro Club vont uniquement à Laurie, jamais au reste de l'équipe.
const LAURIE_EMAIL = 'lauriegetup@gmail.com';
const FROM_ADDRESS = 'lenna@getupprod.fr';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// Neutralise les retours à la ligne (injection d'en-tête) et les guillemets
// (qui casseraient le nom affiché entre guillemets dans le "From") d'une
// valeur saisie par le visiteur avant de l'utiliser dans un en-tête d'email.
function sanitizeHeaderValue(str) {
  return String(str || '').replace(/[\r\n]+/g, ' ').replace(/"/g, "'").trim();
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
  const name = (body.name || '').trim();
  const company = (body.company || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const date = (body.date || '').trim();
  const participants = (body.participants || '').trim();
  const message = (body.message || '').trim();
  const consent = !!body.consent;

  // Anti-spam : même mécanisme que /api/send-resource.js (champ piège
  // invisible + délai minimum de remplissage).
  const honeypotFilled = !!(body.website || '').trim();
  const loadedAt = Number(body.formLoadedAt) || 0;
  const submittedTooFast = loadedAt > 0 && Date.now() - loadedAt < 3000;
  if (honeypotFilled || submittedTooFast) {
    console.warn('Soumission bloquée (anti-spam) :', { honeypotFilled, submittedTooFast, email });
    return res.status(200).json({ ok: true });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !company || !email || !emailPattern.test(email) || !consent) {
    return res.status(400).json({ error: 'Champs manquants ou invalides.' });
  }

  const detailsHtml =
    '<div style="font-family:sans-serif;line-height:1.6;">' +
    '<p><strong>Demande de réservation — Impro Club</strong></p>' +
    '<ul>' +
    '<li>Nom et prénom : ' + escapeHtml(name) + '</li>' +
    '<li>Entreprise : ' + escapeHtml(company) + '</li>' +
    '<li>Email : ' + escapeHtml(email) + '</li>' +
    '<li>Téléphone : ' + (phone ? escapeHtml(phone) : '—') + '</li>' +
    '<li>Date souhaitée : ' + (date ? escapeHtml(date) : '—') + '</li>' +
    '<li>Nombre de participants : ' + (participants ? escapeHtml(participants) : '—') + '</li>' +
    '</ul>' +
    (message ? '<p><strong>Message :</strong><br>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>' : '') +
    '</div>';

  try {
    await getTransporter().sendMail({
      from: '"' + sanitizeHeaderValue(name) + ' via Get Up" <' + FROM_ADDRESS + '>',
      to: LAURIE_EMAIL,
      replyTo: email,
      subject: 'Demande Impro Club – ' + company,
      html: detailsHtml
    });
  } catch (err) {
    console.error('Erreur envoi email Impro Club :', err);
    return res.status(502).json({ error: "L'envoi de l'email a échoué." });
  }

  // Email de confirmation au visiteur : envoyé juste après, mais un échec
  // ici ne doit pas empêcher le visiteur de voir le message de succès — sa
  // demande est déjà bien arrivée chez Laurie à ce stade.
  try {
    var firstName = name.split(' ')[0];
    var confirmationHtml =
      '<div style="font-family:sans-serif;line-height:1.6;">' +
      '<p>Bonjour ' + escapeHtml(firstName) + ',</p>' +
      '<p>Merci pour votre message, il est bien arrivé !</p>' +
      '<p>Laurie reviendra vers vous sous 48&nbsp;h pour échanger sur votre besoin.</p>' +
      '<p>En attendant, vous pouvez découvrir nos formations sur <a href="https://getupskills.vercel.app">getupskills.vercel.app</a>.</p>' +
      '<p>À très vite,<br>L\'équipe Get Up</p>' +
      '</div>';

    await getTransporter().sendMail({
      from: '"Get Up" <' + FROM_ADDRESS + '>',
      to: email,
      replyTo: LAURIE_EMAIL,
      subject: 'Bien reçu, on revient vers vous très vite',
      html: confirmationHtml
    });
  } catch (err) {
    console.error('Erreur envoi email de confirmation au visiteur :', err);
  }

  return res.status(200).json({ ok: true });
};
