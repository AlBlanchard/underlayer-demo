export const getViewerDemoUrl = (
  sessionId: string,
) => {
  return new URL(
    `/viewer/${sessionId}`,
    window.location.origin,
  ).toString();
};