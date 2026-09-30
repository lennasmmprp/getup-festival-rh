// Fonction serverless Vercel — reçoit le formulaire "Réserver Impro Club"
// (page impro-club.html) et envoie la demande directement à Laurie, via
// Gmail SMTP (même mécanisme que /api/send-resource.js).
//
// Nécessite les mêmes variables d'environnement Vercel que send-resource.js :
// - GMAIL_USER : le compte Gmail utilisé pour l'envoi (ex. lauriegetup@gmail.com)
// - GMAIL_APP_PASSWORD : mot de passe d'application généré sur ce compte
const nodemailer = require('nodemailer');

// Destinataire volontairement différent de NOTIFY_EMAIL dans send-resource.js :
// les demandes Impro Club vont uniquement à Laurie, jamais au reste de l'équipe.
const LAURIE_EMAIL = 'Laurie.benatte@getupprod.fr';
const FROM_EMAIL = 'Get Up Skills <laurie.benatte@getupprod.fr>';

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
  const eventType = (body.eventType || '').trim();
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
    '<li>Type d\'événement : ' + (eventType ? escapeHtml(eventType) : '—') + '</li>' +
    '<li>Date souhaitée : ' + (date ? escapeHtml(date) : '—') + '</li>' +
    '<li>Nombre de participants : ' + (participants ? escapeHtml(participants) : '—') + '</li>' +
    '</ul>' +
    (message ? '<p><strong>Message :</strong><br>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>' : '') +
    '</div>';

  try {
    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: LAURIE_EMAIL,
      replyTo: email,
      subject: 'Demande Impro Club – ' + company,
      html: detailsHtml
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi email Impro Club :', err);
    return res.status(502).json({ error: "L'envoi de l'email a échoué." });
  }
};
