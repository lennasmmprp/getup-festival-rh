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
    format: "Formation individuelle → 3x2 h",
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
    ressourceUrl: null,
    ressourceNom: null,
    // Date de sortie annoncée dans l'email de confirmation (tant que la ressource n'est pas prête)
    ressourceDate: "26 octobre"
  },
  {
    id: "ia",
    num: "02",
    tag: "Transformation digitale",
    title: "Apprivoiser l'IA",
    desc: "Levez les peurs, alignez vos équipes, maîtrisez l'outil collectivement.",
    format: "Formation collective 3 h",
    who: "Les équipes confrontées à l'intégration de l'IA dans leur quotidien professionnel.",
    objective: "Transformer l'appréhension face à l'IA en curiosité constructive et créer une dynamique collective d'adoption.",
    apprentissage: null,
    skills: ["Confiance : Oser utiliser l'IA", "Communication : Formuler des demandes efficaces", "Collaboration : Travailler ensemble avec l'IA"],
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
    format: "Formation collective 3 h",
    who: "Équipes en tension, services qui collaborent peu, groupes avec des profils très différents.",
    objective: "Fluidifiez la circulation de l’information, faites coopérer vos services et équilibrez la prise de parole pour que chaque talent, même discret, puisse porter ses idées.",
    apprentissage: [
      { title: "Écouter et favoriser la confiance", text: "Pratiquer l’écoute active et la reformulation" },
      { title: "Accepter, relancer, dynamiser", text: "Accueillir l’idée de l’autre et rebondir dessus (« oui, et »)" },
      { title: "Coopérer pour plus de performance", text: "Coordonner le collectif face à l’imprévu" }
    ],
    skills: ["Écoute active et reformulation", "Expression orale : voix, posture, présence", "Accueil et valorisation des idées des autres", "Capacité à rebondir et à faire avancer la discussion", "Coopération et intelligence collective", "Adaptabilité face à l’imprévu"],
    experience: "Scènes d'improvisation en binôme et en groupe. Exercices d'écoute sans parole. Situations reproduisant les blocages de la vie professionnelle réelle.",
    programme: [
      { title: "Échauffement", text: "Pose du cadre, principes de la voix, corps et écoute" },
      { title: "Expérimentation collective", text: "Exercices et jeux de communication" },
      { title: "Improvisations", text: "En sous-groupe puis collectif" }
    ],
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
    format: "Formation collective 3 h",
    who: "Équipes mixtes Gen X/Y/Z, managers de jeunes équipes, services RH et formation.",
    objective: "Réduisez les incompréhensions entre générations, favorisez la transmission des savoirs et restez connecté aux nouvelles tendances, pour que vos collaborateurs de la Gen Z se sentent compris.",
    apprentissage: [
      { title: "S'ouvrir et se connaître", text: "Déconstruire les préjugés, révéler les points communs" },
      { title: "Aligner les langages", text: "Comprendre les références et les codes de chaque génération" },
      { title: "Coopérer pour plus de performance", text: "Renforcer la coordination collective avec les différences générationnelles" }
    ],
    skills: ["Communication intergénérationnelle", "Écoute active et ouverture aux autres points de vue", "Déconstruction des préjugés", "Compréhension des codes et références de chaque génération", "Coopération au sein d'équipes mixtes", "Transmission des savoirs"],
    experience: "Scènes jouées par des membres de générations différentes, échanges guidés, exercices de traduction intergénérationnelle.",
    programme: [
      { title: "Échauffement", text: "Pose du cadre, principes de la voix, corps et écoute" },
      { title: "Expérimentation collective", text: "Exercices et jeux de communication" },
      { title: "Mises en situation intergénérationnelles", text: "En sous-groupe puis collectif" }
    ],
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
    format: "Formation collective 3 h",
    who: "Recruteurs, managers qui participent aux entretiens, équipes RH.",
    objective: "Vous prenez des décisions de recrutement fondées sur la compétence plutôt que sur des critères subjectifs, pour des recrutements plus objectifs, une marque employeur renforcée et des équipes qui se développent avec les bons profils.",
    apprentissage: [
      { title: "Avoir conscience de ses biais", text: "Identifier l'écart entre ce que je dis et ce que le candidat comprend." },
      { title: "Écouter et mener un entretien sans intrusion", text: "Construire une discussion professionnelle plutôt qu'un interrogatoire." },
      { title: "Coopérer pour plus de performance", text: "Ancrer des réflexes collectifs pour limiter les préjugés." }
    ],
    skills: ["Repérer ses biais et ceux de l'équipe en situation de recrutement", "Évaluer un candidat sur ses compétences plutôt que sur les apparences", "Adopter une posture de recruteur juste : voix, corps et écoute", "Mener un entretien sous forme de discussion professionnelle, sans intrusion", "Coopérer en équipe pour des décisions de recrutement plus objectives"],
    experience: "Simulations d'entretiens avec rôles inversés, débriefings sur les biais observés, mises en situation de décision collective.",
    programme: [
      { title: "Échauffement", text: "Pose du cadre, principes de la voix, corps et écoute." },
      { title: "Expérimentation collective", text: "Exercices et jeux autour des perceptions et des biais." },
      { title: "Mises en situation de recrutements décalés", text: "En sous-groupe puis collectif." }
    ],
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
    format: "Formation collective 3 h",
    who: "Équipes en télétravail total ou partiel, managers d'équipes dispersées géographiquement.",
    objective: "Vous recréez du lien humain malgré le télétravail pour donner plus de sens et d'engagement à votre équipe, renforcer sa cohésion et clarifier les missions de chacun, afin de limiter les non-dits, la déperdition de savoir-faire et le risque de perte de clients.",
    apprentissage: [
      { title: "Recréer du lien malgré l'écran", text: "Sortir de postures professionnelles figées pour se connaître." },
      { title: "Écouter et proposer", text: "Oser prendre la parole en visio." },
      { title: "Coopérer pour plus de performance", text: "Identifier qui peut relayer, appuyer, faire avancer, même à distance." }
    ],
    skills: ["Recréer du lien humain à distance, malgré l'écran", "Sortir des postures professionnelles figées pour mieux se connaître", "Oser prendre la parole et proposer en visio", "Transmettre clairement un message, en face à face comme à distance", "Identifier le rôle et le périmètre de chacun pour mieux coopérer à distance"],
    experience: "Exercices d'improvisation en visio, création de rituels d'équipe, mises en situation de réunions hybrides.",
    programme: [
      { title: "Échauffement", text: "Pose du cadre, principes de la voix, corps et écoute." },
      { title: "Expérimentation collective", text: "Exercices et jeux sur la transmission de messages face à face et à distance." },
      { title: "Mises en situation de travail à distance", text: "En sous-groupe puis collectif." }
    ],
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
