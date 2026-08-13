export const translations = {
  fr: {
    common: {
      demo: 'Démonstration Underlayer',
    },

    creator: {
      progress: {
        connect: 'Connexion',
        deliver: 'Protection',
        analyse: 'Analyse',
        identify: 'Identification',
      },

      qr: {
        eyebrow: 'Étape 1',
        title: 'Connecter un utilisateur',
        description:
          'Scannez ce QR code avec un téléphone pour participer à la démo.',
        waiting: 'En attente d’un utilisateur...',
        session: 'Session',
        join: 'Rejoindre la démo Underlayer',
      },

      viewerConnected: {
        eyebrow: 'Utilisateur connecté',
        title: 'a rejoint la démo',
        description:
          'L’utilisateur est connecté et prêt à recevoir du contenu protégé.',
      },

      encoding: {
        eyebrow: 'Protection du contenu',
        title: 'Encodage de l’identifiant',
        description:
          'Underlayer génère une copie protégée associée à cet utilisateur.',
        status:
          'Intégration de l’identifiant invisible...',
      },

      upload: {
        eyebrow: 'Analyse',
        title: 'Importer la capture',
        description:
          'Importez la capture d’écran reçue de l’utilisateur pour identifier sa copie.',
        drop: 'Déposez la capture ici',
        select: 'ou cliquez pour sélectionner un fichier',
        button: 'Analyser la capture',
        analysing: 'Analyse en cours...',
        errorType: 'Impossible d’analyser cette capture.',
        errorSize: 'L’image doit être inférieure à 10 Mo.',
        error: 'Impossible d’analyser cette capture.',
      },

      analysing: {
        eyebrow: 'Analyse en cours',
        title: 'Recherche de l’identifiant',
        description:
          'Underlayer analyse l’image et recherche son identifiant.',
        status:
          'Recherche de l’identité de l’utilisateur...',
      },

      result: {
        eyebrow: 'Utilisateur identifié',
        description:
          'Underlayer a identifié avec succès l’utilisateur associé à cette copie.',
        restart: 'Nouvelle démo',
      },

      connection: {
        connecting:
          'Connexion à la session...',
        disconnected:
          'Connexion perdue. Reconnexion...',
      },
    },

    viewer: {
      identity: {
        eyebrow: 'Identité',
        title: 'Qui êtes-vous ?',
        description:
          'Choisissez un pseudonyme temporaire pour cette démo.',
        placeholder: 'Votre pseudonyme',
        button: 'Continuer',
        joining: 'Connexion...',
      },

      preparing: {
        title: 'Préparation de votre contenu',
        description:
          'Underlayer génère une version protégée spécialement associée à votre identité.',
      },

      content: {
        eyebrow: 'Contenu prêt',
        title: 'Cette copie est la vôtre',
        description:
          'Cette image protégée a été générée pour',
        instruction:
          'Prenez une capture d’écran de l’image',
        hint:
          'Vous pourrez ensuite la modifier.',
        button:
          'J’ai pris ma capture',
        loading:
          'Chargement du contenu protégé',
      },

      challenge: {
        eyebrow: 'Capture effectuée',
        title: 'Maintenant, modifiez-la.',
        description:
          'Appliquez des modifications courantes à votre capture. Underlayer tentera ensuite d’identifier sa provenance.',
        crop: 'Recadrez l’image',
        contrast:
          'Ajustez le contraste ou la luminosité',
        draw:
          'Ajoutez quelques annotations',
        resize:
          'Compressez ou redimensionnez l’image',
        next: 'Étape suivante',
        instruction:
          'Envoyez la capture modifiée au présentateur.',
      },

      progress: {
        step: 'Étape',
        of: 'sur',
      },
    },
  },

  en: {
    common: {
      demo: 'Underlayer Demo',
    },

    creator: {
      progress: {
        connect: 'Connect',
        deliver: 'Protect',
        analyse: 'Analyse',
        identify: 'Identify',
      },

      qr: {
        eyebrow: 'Step 1',
        title: 'Connect a viewer',
        description:
          'Scan this QR code with a mobile device to join the demonstration.',
        waiting: 'Waiting for viewer...',
        session: 'Session',
        join: 'Join Underlayer demo',
      },

      viewerConnected: {
        eyebrow: 'Viewer connected',
        title: 'joined the demo',
        description:
          'The viewer is connected and ready to receive protected content.',
      },

      encoding: {
        eyebrow: 'Protecting content',
        title: 'Encoding viewer identity',
        description:
          'Underlayer is generating a protected copy linked to this viewer.',
        status:
          'Embedding invisible identifier...',
      },

      upload: {
        eyebrow: 'Analyse',
        title: 'Upload the screenshot',
        description:
          'Upload the screenshot received from the viewer to identify its copy.',
        drop: 'Drop the screenshot here',
        select: 'or click to select a file',
        button: 'Analyse screenshot',
        analysing: 'Analysing...',
        errorType: 'Unable to analyse this screenshot.',
        errorSize: 'The image must be smaller than 10 MB.',
        error: 'Unable to analyse this screenshot.',
      },

      analysing: {
        eyebrow: 'Analysis in progress',
        title: 'Searching for identifier',
        description:
          'Underlayer is analysing the image and searching for its identifier.',
        status:
          'Searching for viewer identity...',
      },

      result: {
        eyebrow: 'Viewer identified',
        description:
          'Underlayer successfully identified the viewer associated with this copy.',
        restart: 'Start another demo',
      },

      connection: {
        connecting:
          'Connecting to demo session...',
        disconnected:
          'Connection lost. Reconnecting...',
      },
    },

    viewer: {
      identity: {
        eyebrow: 'Viewer identity',
        title: 'Who are you?',
        description:
          'Choose a temporary name for this demonstration.',
        placeholder: 'Your name',
        button: 'Continue',
        joining: 'Joining...',
      },

      preparing: {
        title: 'Preparing your content',
        description:
          'Underlayer is generating a protected version specifically linked to your identity.',
      },

      content: {
        eyebrow: 'Content ready',
        title: 'This copy is yours',
        description:
          'This protected image was generated for',
        instruction:
          'Take a screenshot of the image',
        hint:
          'You can modify it afterwards.',
        button:
          'I have my screenshot',
        loading:
          'Loading protected content',
      },

      challenge: {
        eyebrow: 'Screenshot captured',
        title: 'Now modify it.',
        description:
          'Apply common transformations to your screenshot. Underlayer will then try to identify its source.',
        crop: 'Crop the image',
        contrast:
          'Adjust contrast or brightness',
        draw:
          'Add a few annotations',
        resize:
          'Compress or resize the image',
        next: 'Next step',
        instruction:
          'Send the modified screenshot back to the presenter.',
      },

      progress: {
        step: 'Step',
        of: 'of',
      },
    },
  },
} as const;

export type Translations =
  typeof translations.fr;