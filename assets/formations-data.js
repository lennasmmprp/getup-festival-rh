/*
 * Source unique des données de formation — GetUp Corporate.
 *
 * Chargé par index.html (catalogue + panneau) et par rendez-vous/index.html
 * (personnalisation du parcours de réservation). Toute formation référencée
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
    format: "3H · 100% PERSONNALISÉ",
    who: "Managers, commerciaux, dirigeants, tout collaborateur amené à prendre la parole en public.",
    objective: "Développer une présence scénique naturelle et une communication impactante dans tout contexte professionnel.",
    skills: ["Structuration d'un discours captivant", "Gestion du stress et de l'imprévu", "Posture, voix et langage non-verbal", "Écoute et interaction avec l'audience"],
    experience: "Des mises en situation progressives issues de l'improvisation théâtrale : prises de parole courtes, feedback immédiat, exercices de présence et d'ancrage.",
    programme: "Introduction aux techniques de l'impro, exercices de respiration et d'ancrage, pitchs express (30 sec, 2 min, 5 min), gestion de l'imprévu et des questions difficiles, debriefing collectif",
    benefits: ["Pitchs et présentations plus percutants", "Image professionnelle renforcée", "Meilleure représentation en conférence et salon", "Réunions internes plus efficaces"],
    ressourceUrl: null,
    ressourceNom: null
  },
  {
    id: "ia",
    num: "02",
    tag: "Transformation digitale",
    title: "Apprivoiser l'IA",
    desc: "Levez les peurs, alignez vos équipes, maîtrisez l'outil collectivement.",
    format: "3H · 100% PERSONNALISÉ",
    who: "Toutes les équipes confrontées à l'intégration de l'IA dans leur quotidien professionnel.",
    objective: "Transformer l'appréhension face à l'IA en curiosité constructive et créer une dynamique collective d'adoption.",
    skills: ["Compréhension des mécanismes de l'IA", "Communication efficace avec les outils (prompting)", "Coordination collective face à l'innovation", "Gestion du changement par la confiance"],
    experience: "Exercices d'improvisation autour de l'inconnu et de l'adaptation. Mises en situation de collaboration humain/IA. Temps d'expression libre des peurs et des attentes.",
    programme: "Expression des représentations et peurs, démystification par l'expérimentation, exercices de prompting collectif, construction d'une posture d'équipe face à l'IA, plan d'action partagé",
    benefits: ["Équipes alignées sur l'usage réel de l'IA", "Réduction des résistances internes", "Gain de productivité immédiat", "Direction et terrain réconciliés sur le sujet"],
    ressourceUrl: null,
    ressourceNom: null
  },
  {
    id: "communication",
    num: "03",
    tag: "Cohésion d'équipe",
    title: "Redécouvrir la communication",
    desc: "Écoute active, coordination, expression équilibrée dans vos équipes.",
    format: "3H · 100% PERSONNALISÉ",
    who: "Équipes en tension, services qui collaborent peu, groupes avec des profils très différents.",
    objective: "Fluidifier la communication interne et créer les conditions d'une coopération authentique.",
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
    format: "3H · 20 PERSONNES MAX",
    who: "Équipes mixtes Gen X/Y/Z, managers de jeunes équipes, services RH et formation.",
    objective: "Créer un dialogue authentique entre générations pour transformer les incompréhensions en complémentarités.",
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
    tag: "Ressources humaines",
    title: "Recruter sans biais",
    desc: "Des décisions basées sur la compétence, pas sur des critères subjectifs.",
    format: "3H · 100% PERSONNALISÉ",
    who: "Recruteurs, managers qui participent aux entretiens, équipes RH.",
    objective: "Développer une posture de recruteur objectif et équitable pour attirer et sélectionner les meilleurs profils.",
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
    tag: "Travail hybride",
    title: "Souder une équipe à distance",
    desc: "Recréez du lien malgré l'écran, osez prendre la parole en visio.",
    format: "3H · 100% PERSONNALISÉ",
    who: "Équipes en télétravail total ou partiel, managers d'équipes dispersées géographiquement.",
    objective: "Recréer de la proximité et de la confiance dans un contexte de travail hybride ou entièrement distant.",
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
