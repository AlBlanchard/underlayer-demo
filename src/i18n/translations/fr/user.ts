export const user = {
  // IdentityStep
  identity: {
    eyebrow: 'Identité',
    title: 'Qui êtes-vous ?',
    description: 'Choisissez un pseudonyme temporaire pour cette démo.',
    placeholder: 'Votre pseudonyme',
    button: 'Continuer',
    joining: 'Connexion...',
  },

  // PreparingStep
  preparing: {
    title: 'Préparation de votre contenu',
    description: 'Underlayer génère une version protégée spécialement associée à votre identité.',
  },

  // ContentStep
  content: {
    eyebrow: 'Contenu prêt',
    title: 'Cette copie est la vôtre',
    description: 'Cette image protégée a été générée pour',
    instruction: "Prenez une capture d'écran de l'image",
    hint: "Ouvrez l'image en plein écran puis prenez votre capture.",
    button: "J'ai pris ma capture",
    loading: 'Chargement du contenu protégé',
  },

  // DemoProgress
  progress: {
    step: 'Étape',
    of: 'sur',
    identity: 'Identité',
    content: 'Contenu',
    creator: 'Créateur',
    analysis: 'Analyse',
    result: 'Résultat',
  },

  // RoleTransitionStep
  roleTransition: {
    eyebrow: 'Changement de rôle',
    title: 'Vous êtes maintenant le créateur.',
    description:
      'Une copie de votre contenu a été divulguée. Utilisez Underlayer pour retrouver le destinataire associé à cette image.',
    back: 'Retour',
    continue: 'Continuer',
  },

  // UploadStep
  upload: {
    eyebrow: 'Créateur',
    title: "Retrouvez l'origine de la fuite",
    description: "Importez la capture d'écran divulguée pour identifier le destinataire de cette copie.",
    drop: 'Déposez la capture ici',
    select: 'ou cliquez pour sélectionner une image',
    formats: 'PNG, JPEG ou WebP · 10 Mo max.',
    analyse: 'Analyser la capture',
    analysing: 'Analyse en cours...',
    back: 'Retour',
    errorType: 'Veuillez sélectionner une image PNG, JPEG ou WebP.',
    errorSize: "L'image doit être inférieure à 10 Mo.",
    error: "Impossible d'analyser cette capture.",
  },

  // AnalysisStep
  analysis: {
    eyebrow: 'Analyse',
    title: "Recherche de l'identifiant",
    description: "Underlayer analyse la capture et recherche l'identifiant invisible associé à cette copie.",
    status: 'Recherche du destinataire...',
  },

  // ResultStep
  result: {
    eyebrow: 'Source identifiée',
    description: 'Underlayer a identifié le destinataire associé à cette copie.',
    retry: 'Analyser une autre capture',
    restart: 'Relancer la démonstration',
  },
} as const;
