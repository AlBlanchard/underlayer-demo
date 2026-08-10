import type { Viewer } from '../../../types/demo';

interface ProtectedContentProps {
  viewer: Viewer;
  imageUrl: string;
}

const ProtectedContent = ({
  viewer,
  imageUrl,
}: ProtectedContentProps) => {
  return (
    <section className="protectedContent">
      <span className="protectedContent__step">
        Step 2
      </span>

      <h1 className="protectedContent__title">
        Your protected content
      </h1>

      <p className="protectedContent__description">
        This image was generated specifically for{' '}
        <strong>{viewer.username}</strong>.
      </p>

      <div className="protectedContent__imageWrapper">
        <img
          className="protectedContent__image"
          src={imageUrl}
          alt="Protected Underlayer demo content"
        />
      </div>

      <p className="protectedContent__instruction">
        Open the image and take a screenshot.
      </p>
    </section>
  );
};

export default ProtectedContent;