import {
  useState,
} from 'react';
import { useParams } from 'react-router';

import {
  connectViewer,
  encodeContent,
} from '../../../services/demo.service';

import { sendDemoEvent } from '../../../services/demo-sync.service';

import type {
  Viewer,
} from '../../../types/demo';

import ProtectedContent from '../components/ProtectedContent';
import ViewerIdentityForm from '../components/ViewerIdentityForm';

const ViewerPage = () => {
  const { sessionId } = useParams();

  const [viewer, setViewer] =
    useState<Viewer | null>(null);

  const [protectedImageUrl, setProtectedImageUrl] =
    useState<string | null>(null);

  const handleJoin = async (
    username: string,
  ) => {
    if (!sessionId) {
      return;
    }

    const connectedViewer =
      await connectViewer(username);

    setViewer(connectedViewer);

    sendDemoEvent({
      type: 'viewer-connected',
      sessionId,
      viewer: connectedViewer,
    });

    const imageUrl =
      await encodeContent(connectedViewer);

    setProtectedImageUrl(imageUrl);

    sendDemoEvent({
      type: 'content-ready',
      sessionId,
      viewer: connectedViewer,
    });
  };

  if (!sessionId) {
    return (
      <main>
        <p>Invalid demo session.</p>
      </main>
    );
  }

  return (
    <main className="viewerPage">
      {!viewer && (
        <ViewerIdentityForm
          onSubmit={handleJoin}
        />
      )}

      {viewer && !protectedImageUrl && (
        <section>
          <p>Preparing your protected content...</p>
        </section>
      )}

      {viewer && protectedImageUrl && (
        <ProtectedContent
          viewer={viewer}
          imageUrl={protectedImageUrl}
        />
      )}
    </main>
  );
};

export default ViewerPage;