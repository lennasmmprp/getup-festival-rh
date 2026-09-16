// Fonction serverless Vercel — reçoit le formulaire "Recevoir ma ressource"
// et envoie un email personnalisé au visiteur (+ une notification à GetUp
// pour ne perdre aucun lead, aucun CRM n'étant branché sur ce projet).
//
// Nécessite la variable d'environnement RESEND_API_KEY, à définir dans
// Vercel (Project Settings → Environment Variables) — jamais dans le code.
const { getFormationById } = require('../assets/formations-data.js');

const RESEND_API_URL = 'https://api.resend.com/emails';
const NOTIFY_EMAIL = 'laproductiongetup@gmail.com';
// Expéditeur par défaut de Resend, utilisable sans vérifier de domaine.
// À remplacer par une adresse @getup-corporate.fr (ou équivalent) une fois
// le domaine du site vérifié dans Resend, pour une meilleure délivrabilité.
const FROM_EMAIL = 'GetUp Corporate <onboarding@resend.dev>';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

async function sendEmail(payload) {
  const resp = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(function () { return ''; });
    throw new Error('Resend a refusé l\'envoi (' + resp.status + ') ' + detail);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY manquante : configurez-la dans Vercel.');
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

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!firstName || !lastName || !email || !emailPattern.test(email) || !consent) {
    return res.status(400).json({ error: 'Champs manquants ou invalides.' });
  }

  const formation = getFormationById(formationId);

  const resourceIntro = formation
    ? (formation.ressourceNom
        ? 'Comme demandé, voici « ' + escapeHtml(formation.ressourceNom) + ' », en lien avec la formation ' + escapeHtml(formation.title) + '.'
        : 'Votre ressource sur « ' + escapeHtml(formation.title) + ' » est en cours de finalisation par notre équipe — elle vous parviendra très vite. En attendant, voici l\'essentiel : ' + escapeHtml(formation.objective))
    : 'Merci pour votre demande. Notre équipe revient vers vous rapidement avec les informations adaptées à votre besoin.';

  const resourceLinkHtml = formation && formation.ressourceUrl
    ? '<p><a href="' + escapeHtml(formation.ressourceUrl) + '" style="display:inline-block;background:#0D419A;color:#FFF2B2;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:700;">Télécharger la ressource →</a></p>'
    : '';

  const visitorHtml =
    '<div style="font-family:sans-serif;color:#0a0a0a;line-height:1.6;max-width:560px;margin:0 auto;">' +
    '<h1 style="color:#0D419A;font-size:20px;">Bonjour ' + escapeHtml(firstName) + ',</h1>' +
    '<p>' + resourceIntro + '</p>' +
    resourceLinkHtml +
    '<p>Si vous souhaitez aller plus loin, vous pouvez <a href="https://calendly.com/lenna-smm-pro/30min" style="color:#0D419A;">prendre rendez-vous avec nous</a> pour en discuter de vive voix.</p>' +
    '<p style="margin-top:32px;color:rgba(0,0,0,0.5);font-size:12px;">GetUp Corporate — vous recevez cet email suite à votre demande sur notre site.</p>' +
    '</div>';

  const notifyHtml =
    '<div style="font-family:sans-serif;line-height:1.6;">' +
    '<p><strong>Nouvelle demande de ressource</strong></p>' +
    '<ul>' +
    '<li>Nom : ' + escapeHtml(firstName) + ' ' + escapeHtml(lastName) + '</li>' +
    '<li>Email : ' + escapeHtml(email) + '</li>' +
    '<li>Téléphone : ' + (phone ? escapeHtml(phone) : '—') + '</li>' +
    '<li>Entreprise : ' + (company ? escapeHtml(company) : '—') + '</li>' +
    '<li>Formation : ' + (formation ? escapeHtml(formation.title) : '(non identifiée : ' + escapeHtml(formationId) + ')') + '</li>' +
    '</ul>' +
    '</div>';

  try {
    await sendEmail({
      from: FROM_EMAIL,
      to: [email],
      subject: formation ? 'Votre ressource — ' + formation.title : 'Votre demande — GetUp Corporate',
      html: visitorHtml
    });

    await sendEmail({
      from: FROM_EMAIL,
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
