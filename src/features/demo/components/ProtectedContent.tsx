import { useState } from 'react';

import Button from '@/components/common/Button';
import type { Viewer } from '@/types/demo';

import FullscreenImage from './FullscreenImage';

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

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const { t, language } = useLanguage();

  return (
    <section className="protectedContent">

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

        <button
          type="button"
          className="protectedContent__imageWrapper"
          onClick={() => {
            if (isImageLoaded) {
              setIsFullscreen(true);
            }
          }}
          disabled={!isImageLoaded}
          aria-label={
            language === 'fr'
              ? 'Ouvrir l’image en plein écran'
              : 'Open image fullscreen'
          }
        >
          {!isImageLoaded && (
            <div
              className="protectedContent__imageLoader"
              role="status"
              aria-label={
                language === 'fr'
                  ? 'Chargement du contenu protégé'
                  : 'Loading protected content'
              }
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
            alt=""
            onLoad={() => {
              setIsImageLoaded(true);
            }}
          />

          {isImageLoaded && (
            <span
              className="protectedContent__fullscreenHint"
              aria-hidden="true"
            >
              ⛶
            </span>
          )}
        </button>

        <Button
          type="button"
          disabled={!isImageLoaded}
          onClick={onScreenshotTaken}
        >
          {t.user.content.button}
        </Button>
      </div>

      {isFullscreen && (
        <FullscreenImage
          imageUrl={imageUrl}
          onClose={() => {
            setIsFullscreen(false);
          }}
        />
      )}
    </section>
  );
};

export default ProtectedContent;