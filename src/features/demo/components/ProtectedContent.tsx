import { useState } from 'react';

import Button from '@/components/common/Button';
import type { Viewer } from '@/types/demo';

import ViewerProgress from './ViewerProgress';
import { useLanguage } from '@/i18n/useLanguage';

interface ProtectedContentProps {
  viewer: Viewer;
  imageUrl: string;
  onScreenshotTaken: () => void;
}



const ProtectedContent = ({
  viewer,
  imageUrl,
  onScreenshotTaken,
}: ProtectedContentProps) => {
  const [isImageLoaded, setIsImageLoaded] =
    useState(false);

  const { t } = useLanguage();

  return (
    <section className="protectedContent">
      <ViewerProgress currentStep={2} />

      <div className="protectedContent__content">
        <span className="protectedContent__eyebrow">
          {t.user.content.eyebrow}
        </span>

        <h1 className="protectedContent__title">
          {t.user.content.title}
        </h1>

        <p className="protectedContent__description">
          {t.user.content.description}{' '}
          <strong>{viewer.username}</strong>.
        </p>

        <div className="protectedContent__instruction">
          <span className="protectedContent__instructionNumber">
            1
          </span>

          <div>
            <strong>
              {t.user.content.instruction}
            </strong>

            <p>
              {t.user.content.hint}
            </p>
          </div>
        </div>

        <div className="protectedContent__imageWrapper">
          {!isImageLoaded && (
            <div
              className="protectedContent__imageLoader"
              role="status"
              aria-label="Loading protected content"
            >
              <span aria-hidden="true" />
            </div>
          )}

          <img
            className={[
              'protectedContent__image',
              isImageLoaded
                ? 'protectedContent__image--loaded'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            src={imageUrl}
            alt="Protected Underlayer demo content"
            onLoad={() => {
              setIsImageLoaded(true);
            }}
          />
        </div>

        <Button
          type="button"
          disabled={!isImageLoaded}
          onClick={onScreenshotTaken}
        >
          {t.user.content.button}
        </Button>
      </div>
    </section>
  );
};

export default ProtectedContent;