import CreatorHeader from '../components/CreatorHeader';
import QrCodePanel from '../components/QrCodePanel';

const CreatorPage = () => {
  const sessionId = 'demo-123';

  return (
    <div className="creatorPage">
      <CreatorHeader />

      <main className="creatorPage__main">
        <QrCodePanel sessionId={sessionId} />
      </main>
    </div>
  );
};

export default CreatorPage;