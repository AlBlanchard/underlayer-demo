import type {
  DemoSession,
  Viewer,
} from '@/types/demo';

import {
  demoSessionMock,
} from '@/mocks/demo.mock';

const delay = (
  duration: number,
) =>
  new Promise((resolve) =>
    setTimeout(resolve, duration),
  );

export const getDemoSession =
  async (): Promise<DemoSession> => {
    await delay(300);

    const now =
      new Date().toISOString();

    return {
      ...structuredClone(
        demoSessionMock,
      ),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
  };

export const connectViewer =
  async (
    username: string,
  ): Promise<Viewer> => {
    await delay(500);

    return {
      id: crypto.randomUUID(),
      username,
    };
  };

export const encodeContent =
  async (
    viewer: Viewer,
  ): Promise<string> => {
    await delay(1000);

    console.info(
      `Encoding content for ${viewer.username}`,
    );

    return '/demo/protected-image.png';
  };

export const analyseScreenshot =
  async (
    file: File,
    viewer: Viewer,
  ): Promise<Viewer> => {
    await delay(1500);

    console.info(
      `Analysing ${file.name}`,
    );

    return viewer;
  };