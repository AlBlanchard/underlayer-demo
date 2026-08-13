import {
  type FormEvent,
  useState,
} from 'react';

import ViewerProgress from './ViewerProgress';

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

  return (
    <section className="viewerIdentity">
      <ViewerProgress currentStep={1} />

      <div className="viewerIdentity__content">
        <span className="viewerIdentity__eyebrow">
          Viewer identity
        </span>

        <h1 className="viewerIdentity__title">
          Who are you?
        </h1>

        <p className="viewerIdentity__description">
          Choose a temporary name for this demo.
          Underlayer will associate the protected
          content with this identity.
        </p>

        <form
          className="viewerIdentity__form"
          onSubmit={handleSubmit}
        >
          <label
            className="viewerIdentity__label"
            htmlFor="viewer-username"
          >
            Viewer name
          </label>

          <input
            id="viewer-username"
            className="viewerIdentity__input"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="e.g. Alexis"
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
              ? 'Joining...'
              : 'Continue'}
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