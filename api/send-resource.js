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

// Gabarit du mail interne « Nouveau lead » (copie de email-nouveau-lead.html).
// Chaque {{variable}} est remplacée par sa valeur échappée (voir fillTemplate).
const NOTIFY_TEMPLATE = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nouveau lead — Get Up Skills</title>
</head>
<body style="margin:0;padding:0;background:#F2F4F8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F4F8;">
  <tr>
    <td align="center" style="padding:24px 12px;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;font-family:Futura,'Trebuchet MS',Arial,sans-serif;">

        <!-- EN-TÊTE BLEU -->
        <tr>
          <td style="background:#003C94;padding:28px 28px 26px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#FFFFFF;border-radius:999px;padding:7px 18px;font-size:13px;font-weight:800;letter-spacing:1px;color:#003C94;text-transform:uppercase;">
                  🎯 Nouveau lead
                </td>
              </tr>
            </table>
            <div style="font-size:28px;line-height:1.15;font-weight:800;color:#FFFFFF;text-transform:uppercase;margin-top:18px;">
              {{prenom}} {{nom}}
            </div>
            <div style="font-size:15px;color:#FFC6E8;margin-top:6px;">
              a demandé le guide · {{date}}
            </div>
          </td>
        </tr>

        <!-- ÉTIQUETTES : FORMATION + STATUT -->
        <tr>
          <td style="padding:22px 28px 6px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#D30002;border-radius:999px;padding:7px 16px;font-size:13px;font-weight:800;color:#FFFFFF;text-transform:uppercase;">
                  {{formation}}
                </td>
                <td style="width:8px;"></td>
                <td style="background:#FFC6E8;border-radius:999px;padding:7px 16px;font-size:13px;font-weight:700;color:#003C94;">
                  {{statut}}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- COORDONNÉES -->
        <tr>
          <td style="padding:16px 28px 4px 28px;">
            <div style="font-size:12px;font-weight:800;letter-spacing:1px;color:#003C94;text-transform:uppercase;margin-bottom:10px;">
              | Coordonnées
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F7FB;border-radius:14px;">
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #E3E7F0;font-size:14px;color:#6B7280;width:120px;">✉️ Email</td>
                <td style="padding:14px 18px;border-bottom:1px solid #E3E7F0;font-size:15px;color:#111827;"><a href="mailto:{{email}}" style="color:#003C94;font-weight:700;text-decoration:none;">{{email}}</a></td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #E3E7F0;font-size:14px;color:#6B7280;">📞 Téléphone</td>
                <td style="padding:14px 18px;border-bottom:1px solid #E3E7F0;font-size:15px;color:#111827;">{{telephone}}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #E3E7F0;font-size:14px;color:#6B7280;">🏢 Entreprise</td>
                <td style="padding:14px 18px;border-bottom:1px solid #E3E7F0;font-size:15px;color:#111827;">{{entreprise}}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:14px;color:#6B7280;">📬 Newsletter</td>
                <td style="padding:14px 18px;font-size:15px;color:#111827;">{{optin}}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PROVENANCE (UTM) -->
        <tr>
          <td style="padding:20px 28px 4px 28px;">
            <div style="font-size:12px;font-weight:800;letter-spacing:1px;color:#003C94;text-transform:uppercase;margin-bottom:10px;">
              | D'où vient ce lead ?
            </div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border:2px solid #003C94;border-radius:999px;padding:6px 14px;font-size:13px;color:#003C94;"><b>Canal</b> · {{utm_source}}</td>
                <td style="width:6px;"></td>
                <td style="border:2px solid #003C94;border-radius:999px;padding:6px 14px;font-size:13px;color:#003C94;"><b>Format</b> · {{utm_medium}}</td>
              </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
              <tr>
                <td style="background:#003C94;border-radius:999px;padding:7px 16px;font-size:13px;color:#FFFFFF;"><b>Post</b> · {{utm_content}}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ACTION -->
        <tr>
          <td style="padding:26px 28px 30px 28px;">
            <div style="font-size:14px;color:#374151;line-height:1.5;margin-bottom:16px;">
              <b>Prochaine étape :</b> écrire à {{prenom}} sur LinkedIn pour ouvrir la conversation, sans vendre.
            </div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#D30002;border-radius:999px;">
                  <a href="mailto:{{email}}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:800;color:#FFFFFF;text-decoration:none;text-transform:uppercase;letter-spacing:.5px;">Répondre à {{prenom}} →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PIED -->
        <tr>
          <td style="background:#FFC6E8;padding:14px 28px;font-size:12px;color:#003C94;text-align:center;">
            <b>GET UP SKILLS</b> · Notification automatique du formulaire « Recevoir ma ressource »
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

// Mail au visiteur pour le guide « Prise de parole en public », même charte
// que NOTIFY_TEMPLATE. {{bonjour}} = "Bonjour Prénom," ou "Bonjour,".
const GUIDE_TEMPLATE = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Votre guide de la prise de parole en public</title>
</head>
<body style="margin:0;padding:0;background:#F2F4F8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F4F8;">
  <tr>
    <td align="center" style="padding:24px 12px;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;font-family:Futura,'Trebuchet MS',Arial,sans-serif;">

        <!-- EN-TÊTE BLEU -->
        <tr>
          <td style="background:#003C94;padding:28px 28px 26px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#FFFFFF;border-radius:999px;padding:7px 18px;font-size:13px;font-weight:800;letter-spacing:1px;color:#003C94;text-transform:uppercase;">
                  🎤 Votre guide
                </td>
              </tr>
            </table>
            <div style="font-size:26px;line-height:1.15;font-weight:800;color:#FFFFFF;text-transform:uppercase;margin-top:18px;">
              Le guide de la prise de parole en public
            </div>
            <div style="font-size:15px;color:#FFC6E8;margin-top:6px;">
              Get Up Skills · formations par l'improvisation théâtrale
            </div>
          </td>
        </tr>

        <!-- MESSAGE -->
        <tr>
          <td style="padding:26px 28px 4px 28px;font-size:15px;line-height:1.6;color:#374151;">
            <div style="font-size:18px;font-weight:800;color:#003C94;margin-bottom:12px;">{{bonjour}}</div>
            Merci pour votre intérêt ! Voici votre guide : 3 techniques issues de l'impro théâtrale, des exercices concrets et une checklist pour vos prochaines prises de parole.
          </td>
        </tr>

        <!-- TÉLÉCHARGEMENT -->
        <tr>
          <td style="padding:22px 28px 6px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#FFF2B2;border-radius:999px;">
                  <a href="{{guideUrl}}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:800;color:#003C94;text-decoration:none;text-transform:uppercase;letter-spacing:.5px;">Télécharger le guide →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ALLER PLUS LOIN -->
        <tr>
          <td style="padding:22px 28px 30px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F7FB;border-radius:14px;">
              <tr>
                <td style="padding:16px 18px;font-size:14px;line-height:1.55;color:#374151;">
                  Envie d'aller plus loin avec vos équipes ? On en parle 20 minutes.<br>
                  <a href="{{rdvUrl}}" style="color:#003C94;font-weight:800;text-decoration:underline;">Prendre rendez-vous →</a>
                </td>
              </tr>
            </table>
            <div style="font-size:15px;line-height:1.6;color:#374151;margin-top:22px;">
              À très vite,<br><b style="color:#003C94;">L'équipe Get Up Skills</b>
            </div>
          </td>
        </tr>

        <!-- PIED -->
        <tr>
          <td style="background:#FFC6E8;padding:14px 28px;font-size:12px;color:#003C94;text-align:center;">
            Vous recevez cet e-mail suite à votre demande sur notre site.<br>Pour vous désinscrire, écrivez à <a href="mailto:lenna@getupprod.fr" style="color:#003C94;">lenna@getupprod.fr</a>.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, function (_, key) {
    return escapeHtml(vars[key]);
  });
}

// "19/10 à 17h42", heure de Paris.
function formatParisDate(date) {
  const p = {};
  new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).forEach(function (part) { p[part.type] = part.value; });
  return p.day + '/' + p.month + ' à ' + p.hour + 'h' + p.minute;
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
      html: payload.html,
      text: payload.text
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
  // Case facultative (actualités et offres) : n'empêche jamais l'envoi.
  const marketingConsent = body.marketingConsent === true;
  // Provenance (UTM du lien cliqué, ou site d'origine) : sert au suivi des posts.
  const source = String(body.source || '').trim().slice(0, 200);

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
  if (!firstName || !lastName || !email || !emailPattern.test(email)) {
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
          : 'Merci ' + escapeHtml(firstName) + ', votre demande pour « ' + escapeHtml(formation.title) + ' » a bien été enregistrée. Votre ressource est en cours de finalisation. Nous vous l’enverrons par e-mail dès qu’elle sera prête, le <strong>lundi 26 octobre 2026</strong>.')
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
    '<span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;">Get Up Skills — vous recevez cet email suite à votre demande sur notre site.<br>Pour vous désinscrire, écrivez à <a href="mailto:lenna@getupprod.fr" style="color:#999999;">lenna@getupprod.fr</a>.</span>' +
    '</td></tr>' +

    '</table>' +
    '</td></tr>' +
    '</table>';

  // UTM lus un par un dans l'URL de la page du formulaire (en-tête Referer,
  // envoyé par défaut en same-origin). Sans UTM, `source` donne le site d'origine.
  let utm = new URLSearchParams();
  try { utm = new URL(req.headers.referer).searchParams; } catch (e) { /* pas de Referer */ }

  const notifyVars = {
    prenom: firstName,
    nom: lastName,
    email: email,
    telephone: phone || '—',
    entreprise: company || '—',
    formation: formation ? formation.title : '(non identifiée : ' + formationId + ')',
    statut: formation ? (hasRealResource ? '✅ Ressource envoyée' : '⏳ Ressource pas encore prête') : '—',
    optin: marketingConsent ? '✅ Oui' : '❌ Non',
    utm_source: utm.get('utm_source') || (source.indexOf('referrer=') === 0 ? source.slice(9) : '—'),
    utm_medium: utm.get('utm_medium') || '—',
    utm_content: utm.get('utm_content') || '—',
    date: formatParisDate(new Date())
  };

  const guideUrl = resolveResourceUrl(formation && formation.ressourceUrl);
  const rdvUrl = SITE_URL + '/rendez-vous';
  const bonjour = firstName ? 'Bonjour ' + firstName + ',' : 'Bonjour,';
  const visitorEmail = hasRealResource && formation.id === 'prise-de-parole'
    ? {
        to: [email],
        subject: 'Votre guide de la prise de parole en public 🎤',
        html: fillTemplate(GUIDE_TEMPLATE, { bonjour: bonjour, guideUrl: guideUrl, rdvUrl: rdvUrl }),
        text:
          bonjour + '\n\n' +
          "Merci pour votre intérêt ! Voici votre guide : 3 techniques issues de l'impro théâtrale, des exercices concrets et une checklist pour vos prochaines prises de parole.\n\n" +
          'Télécharger le guide : ' + guideUrl + '\n\n' +
          "Envie d'aller plus loin avec vos équipes ? On en parle 20 minutes.\n" +
          'Prendre rendez-vous : ' + rdvUrl + '\n\n' +
          "À très vite,\nL'équipe Get Up Skills\n"
      }
    : {
        to: [email],
        subject: formation
          ? (hasRealResource ? 'Votre ressource — ' + formation.title : 'Votre demande bien reçue — ' + formation.title)
          : 'Votre demande — Get Up Skills',
        html: visitorHtml
      };

  // Un échec du mail visiteur n'empêche ni le mail interne ni l'affichage
  // de la confirmation (le guide reste téléchargeable sur la page).
  try {
    await sendEmail(visitorEmail);
  } catch (err) {
    console.error('Erreur envoi email visiteur :', err);
    notifyVars.statut = '⚠️ Échec envoi au visiteur';
  }

  const notifyHtml = fillTemplate(NOTIFY_TEMPLATE, notifyVars);
  const notifyText =
    'Nouveau lead — ' + notifyVars.prenom + ' ' + notifyVars.nom + ' (' + notifyVars.date + ')\n\n' +
    'Formation : ' + notifyVars.formation + '\n' +
    'Statut : ' + notifyVars.statut + '\n\n' +
    'Email : ' + notifyVars.email + '\n' +
    'Téléphone : ' + notifyVars.telephone + '\n' +
    'Entreprise : ' + notifyVars.entreprise + '\n' +
    'Newsletter : ' + notifyVars.optin + '\n\n' +
    'Canal : ' + notifyVars.utm_source + '\n' +
    'Format : ' + notifyVars.utm_medium + '\n' +
    'Post : ' + notifyVars.utm_content + '\n';

  try {
    await sendEmail({
      to: [NOTIFY_EMAIL],
      reply_to: email,
      subject: 'Nouveau lead — ' + firstName + ' ' + lastName,
      html: notifyHtml,
      text: notifyText
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi email :', err);
    return res.status(502).json({ error: "L'envoi de l'email a échoué." });
  }
};
