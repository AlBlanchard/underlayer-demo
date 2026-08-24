import {
  type FormEvent,
  useState,
} from 'react';

import ViewerProgress from './ViewerProgress';
import { useLanguage } from '../../../i18n/useLanguage';

interface ViewerIdentityFormProps {
  onSubmit: (username: string) => Promise<void>;
}


const ViewerIdentityForm = ({
  onSubmit,
}: ViewerIdentityFormProps) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const trimmedUsername = username.trim();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!trimmedUsername || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit(trimmedUsername);
    } catch {
      setError(
        'Unable to join the demo. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const { t } = useLanguage();

  return (
    <section className="viewerIdentity">
      <ViewerProgress currentStep={1} />

      <div className="viewerIdentity__content">
        <span className="viewerIdentity__eyebrow">
          {t.viewer.identity.eyebrow}
        </span>

        <h1 className="viewerIdentity__title">
          {t.viewer.identity.title}
        </h1>

        <p className="viewerIdentity__description">
          {t.viewer.identity.description}
        </p>

        <form
          className="viewerIdentity__form"
          onSubmit={handleSubmit}
        >
          <label
            className="viewerIdentity__label"
            htmlFor="viewer-username"
          >
            {t.viewer.identity.placeholder}
          </label>

          <input
            id="viewer-username"
            className="viewerIdentity__input"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder={t.viewer.identity.placeholder}
            autoComplete="off"
            maxLength={32}
            required
          />

          <button
            className="viewerIdentity__submit"
            type="submit"
            disabled={!trimmedUsername || isSubmitting}
          >
            {isSubmitting
              ? t.viewer.identity.joining
              : t.viewer.identity.button}
          </button>

          {error && (
            <p
              className="viewerIdentity__error"
              role="alert"
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ViewerIdentityForm;