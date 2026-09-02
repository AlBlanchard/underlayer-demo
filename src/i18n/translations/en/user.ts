export const user = {
  // IdentityStep
  identity: {
    eyebrow: 'Viewer identity',
    title: 'Who are you?',
    description: 'Choose a temporary name for this demonstration.',
    placeholder: 'Your name',
    button: 'Continue',
    joining: 'Joining...',
  },

  // PreparingStep
  preparing: {
    title: 'Preparing your content',
    description: 'Underlayer is generating a protected version specifically linked to your identity.',
  },

  // ContentStep
  content: {
    eyebrow: 'Content ready',
    title: 'This copy is yours',
    description: 'This protected image was generated for',
    instruction: 'Take a screenshot of the image',
    hint: 'Open the image fullscreen, then take your screenshot.',
    button: 'I have my screenshot',
    loading: 'Loading protected content',
  },

  // DemoProgress
  progress: {
    step: 'Step',
    of: 'of',
    identity: 'Identity',
    content: 'Content',
    creator: 'Creator',
    analysis: 'Analysis',
    result: 'Result',
  },

  // RoleTransitionStep
  roleTransition: {
    eyebrow: 'Role change',
    title: 'You are now the creator.',
    description:
      'A copy of your content has been leaked. Use Underlayer to identify the viewer associated with this image.',
    back: 'Back',
    continue: 'Continue',
  },

  // UploadStep
  upload: {
    eyebrow: 'Creator',
    title: 'Find the source of the leak',
    description: 'Upload the leaked screenshot to identify the viewer associated with this copy.',
    drop: 'Drop the screenshot here',
    select: 'or click to select an image',
    formats: 'PNG, JPEG or WebP · max 10 MB.',
    analyse: 'Analyse screenshot',
    analysing: 'Analysing...',
    back: 'Back',
    errorType: 'Please select a PNG, JPEG or WebP image.',
    errorSize: 'The image must be smaller than 10 MB.',
    error: 'Unable to analyse this screenshot.',
  },

  // AnalysisStep
  analysis: {
    eyebrow: 'Analysis',
    title: 'Searching for identifier',
    description:
      'Underlayer is analysing the screenshot and searching for the invisible identifier associated with this copy.',
    status: 'Searching for viewer...',
  },

  // ResultStep
  result: {
    eyebrow: 'Source identified',
    description: 'Underlayer identified the viewer associated with this copy.',
    retry: 'Analyse another screenshot',
    restart: 'Restart demonstration',
  },
} as const;
