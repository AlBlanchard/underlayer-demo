import type {
  DemoSession,
} from '@/types/demo';

interface SessionsResponse {
  sessions: DemoSession[];
}

export const getAdminSessions =
  async (): Promise<DemoSession[]> => {
    const apiUrl =
      import.meta.env
        .VITE_DEMO_API_URL;

    if (!apiUrl) {
      throw new Error(
        'VITE_DEMO_API_URL is not configured.',
      );
    }

    const response =
      await fetch(
        `${apiUrl}/sessions`,
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