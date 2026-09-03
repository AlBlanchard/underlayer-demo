import { type ChangeEvent, type DragEvent, useEffect, useState } from 'react';

import type { Viewer } from '@/types/demo';
import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';

interface ScreenshotUploadProps {
  viewer: Viewer;
  onAnalyse: (file: File) => Promise<void>;
  onBack: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ScreenshotUpload = ({ onAnalyse, onBack }: ScreenshotUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const selectFile = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError(t.user.upload.errorType);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(t.user.upload.errorSize);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile) {
      selectFile(droppedFile);
    }
  };

  const handleAnalyse = async () => {
    if (!file || isAnalysing) {
      return;
    }

    try {
      setIsAnalysing(true);
      setError(null);

      await onAnalyse(file);
    } catch {
      setError(t.user.upload.error);

      setIsAnalysing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { t } = useLanguage();

  return (
    <DemoPanel
      eyebrow={t.user.upload.eyebrow}
      title={t.user.upload.title}
      description={<>{t.user.upload.description}</>}
    >
      <label className="screenshotUpload__dropzone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
        <input
          className="screenshotUpload__input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
        />

        {previewUrl ? (
          <img className="screenshotUpload__preview" src={previewUrl} alt="Screenshot preview" />
        ) : (
          <div className="screenshotUpload__placeholder">
            <strong>{t.user.upload.drop}</strong>

            <span>{t.user.upload.select}</span>

            <small>PNG, JPEG, WebP · max 10 MB</small>
          </div>
        )}
      </label>

      {file && <p className="screenshotUpload__filename">{file.name}</p>}

      {error && (
        <p className="screenshotUpload__error" role="alert">
          {error}
        </p>
      )}

      <div className="screenshotUpload__buttonContainer">
        <button type="button" className="screenshotUpload__back backButton" onClick={onBack}>
          Retour
        </button>

        <button
          className="screenshotUpload__button"
          type="button"
          disabled={!file || isAnalysing}
          onClick={handleAnalyse}
        >
          {isAnalysing ? t.user.upload.analysing : t.user.upload.analyse}
        </button>
      </div>
    </DemoPanel>
  );
};

export default ScreenshotUpload;
