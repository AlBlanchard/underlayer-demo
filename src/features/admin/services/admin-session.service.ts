import type {
  DemoSession,
} from '@/types/demo';

interface SessionsResponse {
  sessions: DemoSession[];
}

interface SessionResponse {
  session: DemoSession;
}

const getApiUrl = () => {
  const apiUrl =
    import.meta.env
      .VITE_DEMO_API_URL;

  if (!apiUrl) {
    throw new Error(
      'VITE_DEMO_API_URL is not configured.',
    );
  }

  return apiUrl;
};

export const getAdminSessions =
  async (): Promise<DemoSession[]> => {
    const response =
      await fetch(
        `${getApiUrl()}/sessions`,
      );

    if (!response.ok) {
      throw new Error(
        'Unable to fetch demo sessions.',
      );
    }

    const data =
      await response.json() as SessionsResponse;

    return data.sessions;
  };

export const createDemoSession =
  async (): Promise<DemoSession> => {
    const response =
      await fetch(
        `${getApiUrl()}/sessions`,
        {
          method: 'POST',
        },
      );

    if (!response.ok) {
      throw new Error(
        'Unable to create demo session.',
      );
    }

    const data =
      await response.json() as SessionResponse;

    return data.session;
  };

export const closeDemoSession =
  async (
    sessionId: string,
  ): Promise<void> => {
    const response =
      await fetch(
        `${getApiUrl()}/sessions/${sessionId}`,
        {
          method: 'DELETE',
        },
      );

    if (!response.ok) {
      throw new Error(
        'Unable to close demo session.',
      );
    }
  };