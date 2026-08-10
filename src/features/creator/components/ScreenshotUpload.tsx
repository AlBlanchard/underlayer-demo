import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useState,
} from 'react';

import type { Viewer } from '../../../types/demo';

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
  viewer,
  onAnalyse,
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
            'Please select a PNG, JPEG or WebP image.',
        );
        return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
        setError(
            'The image must be smaller than 10 MB.',
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
            'Unable to analyse this screenshot.',
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

  return (
    <section className="screenshotUpload">
      <span className="screenshotUpload__step">
        Content delivered
      </span>

      <h1 className="screenshotUpload__title">
        Find the source
      </h1>

      <p className="screenshotUpload__description">
        The protected content was delivered to{' '}
        <strong>{viewer.username}</strong>.
        Upload the leaked screenshot to identify
        its source.
      </p>

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
            <strong>Drop the screenshot here</strong>

            <span>
              or click to select an image
            </span>

            <small>
              PNG, JPEG or WebP · max 10 MB
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
          ? 'Analysing...'
          : 'Analyse screenshot'}
      </button>
    </section>
  );
};

export default ScreenshotUpload;