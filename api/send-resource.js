// Fonction serverless Vercel — reçoit le formulaire "Recevoir ma ressource"
// et envoie un email personnalisé au visiteur.
//
// Nécessite la variable d'environnement RESEND_API_KEY, à définir dans
// Vercel (Project Settings → Environment Variables) — jamais dans le code.
const { getFormationById } = require('../assets/formations-data.js');

const RESEND_API_URL = 'https://api.resend.com/emails';
const NOTIFY_EMAIL = 'lenna.smm.pro@gmail.com';
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
    ? '<tr><td style="padding:8px 0 4px;">' +
      '<a href="' + escapeHtml(formation.ressourceUrl) + '" style="display:inline-block;background:#0D419A;color:#FFF2B2;padding:14px 28px;border-radius:6px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Télécharger la ressource →</a>' +
      '</td></tr>'
    : '';

  const visitorHtml =
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f3;padding:40px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">' +

    // Bandeau bleu
    '<tr><td style="background:#0D419A;padding:32px 40px;text-align:center;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;color:#FFF2B2;letter-spacing:1px;text-transform:uppercase;">GetUp Corporate</span>' +
    '</td></tr>' +

    // Corps
    '<tr><td style="padding:40px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td style="padding-bottom:16px;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:800;color:#012460;">Bonjour ' + escapeHtml(firstName) + ',</span>' +
    '</td></tr>' +
    '<tr><td style="padding-bottom:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#333333;">' + resourceIntro + '</td></tr>' +
    resourceLinkHtml +
    '<tr><td style="padding-top:24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#333333;">' +
    'Si vous souhaitez aller plus loin, vous pouvez <a href="https://calendly.com/lenna-smm-pro/30min" style="color:#0D419A;font-weight:700;text-decoration:none;">prendre rendez-vous avec nous</a> pour en discuter de vive voix.' +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +

    // Footer
    '<tr><td style="background:#f8f7f3;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;">GetUp Corporate — vous recevez cet email suite à votre demande sur notre site.</span>' +
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
