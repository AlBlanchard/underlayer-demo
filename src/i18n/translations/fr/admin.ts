export const admin = {
  // DemoProgress
  progress: {
    identity: 'Identité',
    content: 'Contenu',
    creator: 'Créateur',
    analysis: 'Analyse',
    result: 'Résultat',
  },

  // AdminPage
  page: {
    eyebrow: 'Administration',
    title: 'Supervision des démonstrations',
    description: 'Suivez les sessions actives et consultez leur progression.',
    sessions: 'Sessions',
    active: 'actives',
    creating: 'Création...',
    newDemo: 'Nouvelle démo',
    emptyTitle: 'Aucune session active',
    emptyDescription: "Les démonstrations apparaîtront ici automatiquement lorsqu'un utilisateur se connectera.",
  },

  // CreateDemoPanel
  createDemo: {
    eyebrow: 'New demonstration',
    title: 'Invite a user',
    description: 'Share this link with the prospect to start the demonstration.',
    close: 'Close',
    qrTitle: 'Demo QR code',
    copied: 'Link copied!',
    copy: 'Copy link',
    session: 'Session',
  },

  // SessionCard
  status: {
    waitingForViewer: "En attente de l'utilisateur",
    viewerConnected: 'Utilisateur connecté',
    encoding: 'Encodage en cours',
    contentReady: 'Contenu protégé prêt',
    waitingForUpload: 'En attente de la capture',
    analysing: 'Analyse en cours',
    identified: 'Utilisateur identifié',
    error: 'Erreur',
  },

  // QrCode
  qr: {
    eyebrow: 'Étape 1',
    title: 'Connecter un utilisateur',
    description: 'Scannez ce QR code avec un téléphone pour participer à la démo.',
    waiting: "En attente d'un utilisateur...",
    session: 'Session',
    join: 'Rejoindre la démo Underlayer',
  },

  // ViewerConnected
  viewerConnected: {
    eyebrow: 'Utilisateur connecté',
    title: 'a rejoint la démo',
    description: "L'utilisateur est connecté et prêt à recevoir du contenu protégé.",
  },

  // Encoding
  encoding: {
    eyebrow: 'Protection du contenu',
    title: "Encodage de l'identifiant",
    description: 'Underlayer génère une copie protégée associée à cet utilisateur.',
    status: "Intégration de l'identifiant invisible...",
  },

  // Upload
  upload: {
    eyebrow: 'Analyse',
    title: 'Importer la capture',
    description: "Importez la capture d'écran reçue de l'utilisateur pour identifier sa copie.",
    drop: 'Déposez la capture ici',
    select: 'ou cliquez pour sélectionner un fichier',
    button: 'Analyser la capture',
    analysing: 'Analyse en cours...',
    errorType: "Impossible d'analyser cette capture.",
    errorSize: "L'image doit être inférieure à 10 Mo.",
    error: "Impossible d'analyser cette capture.",
  },

  // Analysing
  analysing: {
    eyebrow: 'Analyse en cours',
    title: "Recherche de l'identifiant",
    description: "Underlayer analyse l'image et recherche son identifiant.",
    status: "Recherche de l'identité de l'utilisateur...",
  },

  // Result
  result: {
    eyebrow: 'Utilisateur identifié',
    description: "Underlayer a identifié avec succès l'utilisateur associé à cette copie.",
    restart: 'Nouvelle démo',
  },

  // ConnectionStatus
  connection: {
    connecting: 'Connexion à la session...',
    disconnected: 'Connexion perdue. Reconnexion...',
  },

  // SessionCard
  session: {
    waitingUser: 'Utilisateur en attente',
    lastScreenshot: 'Dernière capture analysée',
    screenshotAlt: 'Capture envoyée pour analyse',
    noScreenshot: 'Aucune capture envoyée.',
    user: 'Utilisateur',
    result: 'Résultat',
    createdAt: 'Créée à',
    sourceIdentified: 'Source identifiée',
    demoLink: 'Lien de la démonstration',
    copied: 'Copié !',
    copy: 'Copier',
    close: 'Fermer la session',
  },
} as const;
