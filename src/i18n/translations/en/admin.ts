export const admin = {
  // DemoProgress
  progress: {
    identity: 'Identity',
    content: 'Content',
    creator: 'Creator',
    analysis: 'Analysis',
    result: 'Result',
  },

  // AdminPage
  page: {
    eyebrow: 'Administration',
    title: 'Demo supervision',
    description: 'Monitor active sessions and follow their progress.',
    sessions: 'Sessions',
    active: 'active',
    creating: 'Creating...',
    newDemo: 'New demo',
    emptyTitle: 'No active sessions',
    emptyDescription: 'Demo sessions will appear here automatically when a user connects.',
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
    waitingForViewer: 'Waiting for user',
    viewerConnected: 'User connected',
    encoding: 'Encoding',
    contentReady: 'Protected content ready',
    waitingForUpload: 'Waiting for screenshot',
    analysing: 'Analysing',
    identified: 'User identified',
    error: 'Error',
  },

  // QrCode
  qr: {
    eyebrow: 'Step 1',
    title: 'Connect a viewer',
    description: 'Scan this QR code with a mobile device to join the demonstration.',
    waiting: 'Waiting for viewer...',
    session: 'Session',
    join: 'Join Underlayer demo',
  },

  // ViewerConnected
  viewerConnected: {
    eyebrow: 'Viewer connected',
    title: 'joined the demo',
    description: 'The viewer is connected and ready to receive protected content.',
  },

  // Encoding
  encoding: {
    eyebrow: 'Protecting content',
    title: 'Encoding viewer identity',
    description: 'Underlayer is generating a protected copy linked to this viewer.',
    status: 'Embedding invisible identifier...',
  },

  // Upload
  upload: {
    eyebrow: 'Analyse',
    title: 'Upload the screenshot',
    description: 'Upload the screenshot received from the viewer to identify its copy.',
    drop: 'Drop the screenshot here',
    select: 'or click to select a file',
    button: 'Analyse screenshot',
    analysing: 'Analysing...',
    errorType: 'Unable to analyse this screenshot.',
    errorSize: 'The image must be smaller than 10 MB.',
    error: 'Unable to analyse this screenshot.',
  },

  // Analysing
  analysing: {
    eyebrow: 'Analysis in progress',
    title: 'Searching for identifier',
    description: 'Underlayer is analysing the image and searching for its identifier.',
    status: 'Searching for viewer identity...',
  },

  // Result
  result: {
    eyebrow: 'Viewer identified',
    description: 'Underlayer successfully identified the viewer associated with this copy.',
    restart: 'Start another demo',
  },

  // ConnectionStatus
  connection: {
    connecting: 'Connecting to demo session...',
    disconnected: 'Connection lost. Reconnecting...',
  },

  // SessionCard
  session: {
    waitingUser: 'Waiting for user',
    lastScreenshot: 'Last analysed screenshot',
    screenshotAlt: 'Screenshot submitted for analysis',
    noScreenshot: 'No screenshot submitted.',
    user: 'User',
    result: 'Result',
    createdAt: 'Created at',
    sourceIdentified: 'Source identified',
    demoLink: 'Demo link',
    copied: 'Copied!',
    copy: 'Copy',
    close: 'Close session',
  },
} as const;
