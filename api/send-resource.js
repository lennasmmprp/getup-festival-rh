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
  const hasResource = !!(formation && formation.ressourceNom);

  const introText = formation
    ? (hasResource
        ? 'Merci ' + escapeHtml(firstName) + ' ! Comme promis, votre ressource sur « ' + escapeHtml(formation.title) + ' » est prête.'
        : 'Votre ressource sur « ' + escapeHtml(formation.title) + ' » est en cours de finalisation par notre équipe — elle vous parviendra très vite. En attendant, voici l\'essentiel : ' + escapeHtml(formation.objective))
    : 'Merci pour votre demande. Notre équipe revient vers vous rapidement avec les informations adaptées à votre besoin.';

  // Carte ressource mise en avant, uniquement quand une vraie ressource existe
  // (formation.ressourceNom renseigné) — sinon on reste sur un simple texte.
  const resourceCardHtml = hasResource
    ? '<tr><td style="padding:4px 0 8px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4fb;border:1px solid #dde6f7;border-radius:12px;">' +
      '<tr><td style="padding:28px 28px 24px;">' +
      '<span style="display:inline-block;background:#FFF2B2;color:#0D419A;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;border-radius:999px;margin-bottom:14px;">Votre ressource</span><br>' +
      '<span style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;color:#012460;line-height:1.3;margin-bottom:10px;">' + escapeHtml(formation.ressourceNom) + '</span>' +
      '<span style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a5568;margin-bottom:20px;">' + escapeHtml(formation.objective) + '</span>' +
      '<a href="' + escapeHtml(formation.ressourceUrl) + '" style="display:inline-block;background:#0D419A;color:#FFF2B2;padding:14px 30px;border-radius:6px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Télécharger la ressource →</a>' +
      '</td></tr>' +
      '</table>' +
      '</td></tr>'
    : '';

  const visitorHtml =
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f3;padding:40px 16px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">' +

    // Accent haut
    '<tr><td style="background:#FFF2B2;height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>' +

    // Bandeau bleu
    '<tr><td style="background:#0D419A;padding:32px 40px;text-align:center;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;color:#FFF2B2;letter-spacing:1px;text-transform:uppercase;">GetUp Corporate</span><br>' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:0.5px;">Formations par l\'improvisation théâtrale</span>' +
    '</td></tr>' +

    // Corps
    '<tr><td style="padding:36px 40px 8px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td style="padding-bottom:16px;">' +
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:800;color:#012460;">Bonjour ' + escapeHtml(firstName) + ',</span>' +
    '</td></tr>' +
    '<tr><td style="padding-bottom:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#333333;">' + introText + '</td></tr>' +
    resourceCardHtml +
    '<tr><td style="padding:24px 0 8px;border-top:1px solid #f0f0f0;margin-top:8px;">' +
    '<span style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#333333;margin-bottom:12px;">Envie d\'aller plus loin ?</span>' +
    '<a href="https://calendly.com/lenna-smm-pro/30min" style="display:inline-block;background:#ffffff;color:#0D419A;padding:12px 24px;border-radius:6px;border:1.5px solid #0D419A;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.3px;">Réserver un appel de 30 min →</a>' +
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
