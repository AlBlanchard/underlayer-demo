interface AdminProgressTranslations {
  admin: {
    progress: {
      identity: string;
      content: string;
      creator: string;
      analysis: string;
      result: string;
    };
  };
}

/**
 * Construit les étapes de progression de l'Admin à partir des traductions courantes.
 */
export const getAdminProgressSteps = (t: AdminProgressTranslations) => [
  {
    id: 'identity',
    label: t.admin.progress.identity,
    role: 'viewer' as const,
  },
  {
    id: 'content',
    label: t.admin.progress.content,
    role: 'viewer' as const,
  },
  {
    id: 'creator',
    label: t.admin.progress.creator,
    role: 'creator' as const,
  },
  {
    id: 'analysis',
    label: t.admin.progress.analysis,
    role: 'creator' as const,
  },
  {
    id: 'result',
    label: t.admin.progress.result,
    role: 'creator' as const,
  },
];
