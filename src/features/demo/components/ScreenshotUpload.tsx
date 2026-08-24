import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useState,
} from 'react';

import type { Viewer } from '@/types/demo';
import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';

interface ScreenshotUploadProps {
  viewer: Viewer;
  onAnalyse: (file: File) => Promise<void>;
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ScreenshotUpload = ({
  onAnalyse
}: ScreenshotUploadProps) => {
    
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);
    const [error, setError] =
        useState<string | null>(null);
    const [isAnalysing, setIsAnalysing] =
        useState(false);

    const selectFile = (selectedFile: File) => {
        if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
        setError(
            t.admin.upload.errorType,
        );
        return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
        setError(
            t.admin.upload.errorSize,
        );
        return;
        }

        if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        }

        setError(null);
        setFile(selectedFile);
        setPreviewUrl(
        URL.createObjectURL(selectedFile),
        );
    };

    const handleChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
        selectFile(selectedFile);
        }
    };

    const handleDrop = (
        event: DragEvent<HTMLLabelElement>,
    ) => {
        event.preventDefault();

        const droppedFile =
        event.dataTransfer.files[0];

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
        setError(
            t.admin.upload.error,
        );

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
        eyebrow={t.admin.upload.eyebrow}
        title={t.admin.upload.title}
        description={
          <>
            {t.admin.upload.description}
          </>
        }
      >

      <label
        className="screenshotUpload__dropzone"
        onDragOver={(event) =>
          event.preventDefault()
        }
        onDrop={handleDrop}
      >
        <input
          className="screenshotUpload__input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
        />

        {previewUrl ? (
          <img
            className="screenshotUpload__preview"
            src={previewUrl}
            alt="Screenshot preview"
          />
        ) : (
          <div className="screenshotUpload__placeholder">
            <strong>{t.admin.upload.drop}</strong>

            <span>
              {t.admin.upload.select}
            </span>

            <small>
              PNG, JPEG, WebP · max 10 MB
            </small>
          </div>
        )}
      </label>

      {file && (
        <p className="screenshotUpload__filename">
          {file.name}
        </p>
      )}

      {error && (
        <p
          className="screenshotUpload__error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        className="screenshotUpload__button"
        type="button"
        disabled={!file || isAnalysing}
        onClick={handleAnalyse}
      >
        {isAnalysing
          ? t.admin.upload.analysing
          : t.admin.upload.button}
      </button>
    </DemoPanel>
  );
};

export default ScreenshotUpload;