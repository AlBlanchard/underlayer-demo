import { useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/i18n/useLanguage';

interface FullscreenImageProps {
  imageUrl: string;
  onClose: () => void;
}

const FullscreenImage = ({ imageUrl, onClose }: FullscreenImageProps) => {
  const { language } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);

  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null;

      setIsNativeFullscreen(isFullscreen);

      if (!isFullscreen) {
        onClose();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const openFullscreen = async () => {
      try {
        await container.requestFullscreen();
        setIsNativeFullscreen(true);
      } catch {
        // The component itself remains a fullscreen
        // visual fallback.
      }
    };

    void openFullscreen();
  }, []);

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="fullscreenImage"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'fr' ? 'Image protégée en plein écran' : 'Protected image fullscreen'}
    >
      <button
        type="button"
        className="fullscreenImage__close"
        onClick={() => {
          void handleClose();
        }}
        aria-label={language === 'fr' ? 'Fermer le plein écran' : 'Close fullscreen'}
      >
        ×
      </button>

      <img className="fullscreenImage__image" src={imageUrl} alt="" />

      {!isNativeFullscreen && (
        <span className="fullscreenImage__hint">{language === 'fr' ? 'Mode plein écran' : 'Fullscreen mode'}</span>
      )}
    </div>
  );
};

export default FullscreenImage;
