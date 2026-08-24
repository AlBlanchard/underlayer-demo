import { useLanguage } from '../../../i18n/useLanguage';

const CreatorHeader = () => {
  const {
    language,
    setLanguage,
  } = useLanguage();

  
  return (
    <header className="creatorHeader">
      <span className="creatorHeader__brand">
        Underlayer
      </span>

      <div
        className="creatorHeader__languages"
        aria-label="Language"
      >
        <button
          type="button"
          className={
            language === 'fr'
              ? 'is-active'
              : undefined
          }
          onClick={() =>
            setLanguage('fr')
          }
        >
          FR
        </button>

        <span aria-hidden="true">
          /
        </span>

        <button
          type="button"
          className={
            language === 'en'
              ? 'is-active'
              : undefined
          }
          onClick={() =>
            setLanguage('en')
          }
        >
          EN
        </button>
      </div>
    </header>
  );
};

export default CreatorHeader;