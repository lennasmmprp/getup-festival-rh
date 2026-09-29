/*
 * Source unique des données de formation — Get Up Skills.
 *
 * Chargé par formations.html (catalogue + panneau), rendez-vous.html
 * (personnalisation du parcours de réservation) et recevoir-ma-ressource/index.html.
 * Toute formation référencée
 * ailleurs sur le site (cartes, boutons "Prendre rendez-vous", etc.) doit
 * utiliser l'`id` défini ici — jamais le nom affiché — pour ne jamais mélanger
 * deux formations entre elles.
 *
 * ressourceUrl / ressourceNom : tant qu'aucune ressource réelle n'existe pour
 * une formation, ces deux champs restent à `null`. Le code appelant doit
 * alors afficher un bouton de prise de rendez-vous — jamais un faux lien de
 * ressource ni une ressource générique. Dès qu'un lien réel (PDF, Drive...)
 * est fourni, renseigner les deux champs ici suffit à l'activer partout.
 */
var FORMATIONS = [
  {
    id: "prise-de-parole",
    num: "01",
    tag: "Intelligence relationnelle",
    title: "Prise de parole en public",
    desc: "Pitchs, CODIR, réunions : prenez le contrôle de chaque prise de parole.",
    format: "Formation individuelle → 2x2 h",
    who: ["Managers", "Commerciaux", "Dirigeants", "Auto-entrepreneurs"],
    objective: "Faire de chaque prise de parole un levier de performance pour l'entreprise.",
    apprentissage: "Apprenez à incarner une posture impactante, construire un discours marquant et transformer l'imprévu en opportunité.",
    skills: ["Structuration d'un discours captivant", "Gestion du stress et de l'imprévu", "Posture, voix et langage non-verbal", "Écoute et interaction avec l'audience"],
    experience: "Des mises en situation progressives issues de l'improvisation théâtrale : prises de parole courtes, feedback immédiat, exercices de présence et d'ancrage.",
    programme: [
      { title: "Les fondations", text: "Ancrage, écoute et posture pour prendre la parole avec plus d'impact." },
      { title: "Voix, stress & storytelling", text: "Maîtriser sa voix, gérer son stress et construire un discours clair et engageant." },
      { title: "Émotions & improvisation", text: "Captiver son audience, gérer l'imprévu et rebondir avec aisance en toute situation." }
    ],
    benefits: ["Pitchs et présentations plus percutants", "Image professionnelle renforcée", "Meilleure représentation en conférence et salon", "Réunions internes plus efficaces"],
    ressourceUrl: "/ressources/lead-magnet-getup-p1-4.pdf",
    ressourceNom: "Les 3 techniques de nos artistes pour captiver votre audience"
  },
  {
    id: "ia",
    num: "02",
    tag: "Transformation digitale",
    title: "Apprivoiser l'IA",
    desc: "Levez les peurs, alignez vos équipes, maîtrisez l'outil collectivement.",
    format: "Formation collective — 3 h",
    who: "Les équipes confrontées à l'intégration de l'IA dans leur quotidien professionnel.",
    objective: "Transformer l'appréhension face à l'IA en curiosité constructive et créer une dynamique collective d'adoption.",
    apprentissage: null,
    skills: ["Confiance — Oser utiliser l'IA", "Communication — Formuler des demandes efficaces", "Collaboration — Travailler ensemble avec l'IA"],
    experience: "Exercices d'improvisation autour de l'inconnu et de l'adaptation. Mises en situation de collaboration humain/IA. Temps d'expression libre des peurs et des attentes.",
    programme: [
      { title: "Échauffement", text: "Voix, corps & écoute" },
      { title: "Expérimentation", text: "Exercices & jeux de communication" },
      { title: "Mises en situation", text: "Comprendre l'IA en collectif" }
    ],
    benefits: ["Équipes alignées sur l'usage réel de l'IA", "Réduction des résistances internes", "Gain de productivité immédiat", "Direction et terrain réconciliés sur le sujet"],
    // TEST TEMPORAIRE — contenu placeholder à but de démo visuelle de l'email
    // (thème chat, clin d'œil "chat/IA"), à remplacer par la vraie ressource.
    ressourceUrl: "https://cataas.com/cat",
    ressourceNom: "Le guide du Chat qui a apprivoisé l'IA"
  },
  {
    id: "communication",
    num: "03",
    tag: "Cohésion d'équipe",
    title: "Redécouvrir la communication",
    desc: "Écoute active, coordination, communication saine dans vos équipes.",
    format: "Formation collective — 3 h",
    who: "Équipes en tension, services qui collaborent peu, groupes avec des profils très différents.",
    objective: "Fluidifier la communication interne et créer les conditions d'une coopération authentique.",
    apprentissage: null,
    skills: ["Écoute active et reformulation", "Principe du oui-et (acceptation et rebond)", "Prise de parole équilibrée", "Coordination face à l'imprévu"],
    experience: "Scènes d'improvisation en binôme et en groupe. Exercices d'écoute sans parole. Situations reproduisant les blocages de la vie professionnelle réelle.",
    programme: "Diagnostic des modes de communication, exercices d'écoute profonde, scènes de co-construction, travail sur les silences et la place de chacun, retours en groupe",
    benefits: ["Information qui circule mieux", "Moins de malentendus et de tensions", "Profils discrets mieux inclus", "Services en silos qui se rapprochent"],
    ressourceUrl: null,
    ressourceNom: null
  },
  {
    id: "generation-z",
    num: "04",
    tag: "Management intergénérationnel",
    title: "Dialoguer avec la Gen Z",
    desc: "Déconstruisez les préjugés, alignez les langages, créez la cohésion.",
    format: "Formation collective — 3 h",
    who: "Équipes mixtes Gen X/Y/Z, managers de jeunes équipes, services RH et formation.",
    objective: "Créer un dialogue authentique entre générations pour transformer les incompréhensions en complémentarités.",
    apprentissage: null,
    skills: ["Déconstruction des stéréotypes générationnels", "Adaptation du langage et des codes", "Valorisation des forces de chaque génération", "Construction d'une culture commune"],
    experience: "Scènes jouées par des membres de générations différentes, échanges guidés, exercices de traduction intergénérationnelle.",
    programme: "Cartographie des représentations mutuelles, mise en scène des incompréhensions, exercices de traduction, construction de ponts communs, engagements collectifs",
    benefits: ["Réduction des conflits générationnels", "Meilleure rétention des talents Gen Z", "Transmission des savoirs facilitée", "Marque employeur renforcée"],
    ressourceUrl: null,
    ressourceNom: null
  },
  {
    id: "recrutement",
    num: "05",
    tag: "Anti-discrimination",
    title: "Recruter sans biais",
    desc: "Basez vos décisions sur la compétence, pas sur des critères subjectifs.",
    format: "Formation collective — 3 h",
    who: "Recruteurs, managers qui participent aux entretiens, équipes RH.",
    objective: "Développer une posture de recruteur objectif et équitable pour attirer et sélectionner les meilleurs profils.",
    apprentissage: null,
    skills: ["Identification de ses propres biais cognitifs", "Conduite d'entretien structurée", "Évaluation basée sur les compétences", "Décision collective objective"],
    experience: "Simulations d'entretiens avec rôles inversés, débriefings sur les biais observés, mises en situation de décision collective.",
    programme: "Sensibilisation aux biais inconscients, jeux de rôle entretien, grilles d'évaluation objective, simulation de comité de sélection, plan d'action individuel",
    benefits: ["Recrutements plus objectifs et équitables", "Meilleure marque employeur", "Équipes plus diversifiées et performantes", "Réduction du turnover lié aux mauvais recrutements"],
    ressourceUrl: null,
    ressourceNom: null
  },
  {
    id: "equipe-distance",
    num: "06",
    tag: "Télétravail",
    title: "Souder une équipe à distance",
    desc: "Recréez du lien malgré l'écran, osez prendre la parole en visio.",
    format: "Formation collective — 3 h",
    who: "Équipes en télétravail total ou partiel, managers d'équipes dispersées géographiquement.",
    objective: "Recréer de la proximité et de la confiance dans un contexte de travail hybride ou entièrement distant.",
    apprentissage: null,
    skills: ["Présence et expression en visioconférence", "Création de rituels de cohésion à distance", "Communication non-verbale adaptée à l'écran", "Identification des relais informels à distance"],
    experience: "Exercices d'improvisation en visio, création de rituels d'équipe, mises en situation de réunions hybrides.",
    programme: "Diagnostic du vécu à distance, exercices de présence en visio, création de rituels collectifs, cartographie des ressources informelles, engagements d'équipe",
    benefits: ["Lien humain recréé malgré la distance", "Réunions hybrides plus inclusives", "Moins d'isolement et de démotivation", "Meilleure connaissance mutuelle des périmètres"],
    ressourceUrl: null,
    ressourceNom: null
  }
];

// Petit utilitaire partagé : récupère une formation par son id unique.
// Retourne null si l'id est absent ou inconnu — jamais une formation par défaut.
function getFormationById(id) {
  if (!id) return null;
  for (var i = 0; i < FORMATIONS.length; i++) {
    if (FORMATIONS[i].id === id) return FORMATIONS[i];
  }
  return null;
}

// Rend ce fichier utilisable à la fois dans le navigateur (var globale FORMATIONS)
// et côté serveur via require() (les fonctions Vercel dans /api) — une seule
// source de vérité pour les formations, jamais deux listes à maintenir.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FORMATIONS: FORMATIONS, getFormationById: getFormationById };
}
