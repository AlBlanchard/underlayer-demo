import { demoSessionMock } from '../mocks/demo.mock';
import type { DemoSession, Viewer } from '../types/demo';

const delay = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const getDemoSession = async (): Promise<DemoSession> => {
  await delay(300);

  return structuredClone(demoSessionMock);
};

export const connectViewer = async (
  username: string,
): Promise<Viewer> => {
  await delay(500);

  return {
    id: crypto.randomUUID(),
    username,
  };
};

export const encodeContent = async (
  viewer: Viewer,
): Promise<string> => {
  await delay(1000);

  console.info(`Encoding content for ${viewer.username}`);

  return '/demo/protected-image.jpg';
};

export const analyseScreenshot = async (
  file: File,
  viewer: Viewer,
): Promise<Viewer> => {
  await delay(1500);

  console.info(`Analysing ${file.name}`);

  return viewer;
};