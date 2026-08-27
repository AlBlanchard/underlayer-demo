import { useLanguage } from '@/i18n/useLanguage';

const AppHeader = () => {
  const {
    language,
    setLanguage,
  } = useLanguage();

  return (
    <header className="appHeader">
      <span className="appHeader__brand">
        Underlayer
      </span>

      <div
        className="appHeader__languageSwitcher"
        aria-label="Language"
      >
        <button
          type="button"
          className={[
            'appHeader__languageButton',
            language === 'fr'
              ? 'appHeader__languageButton--active'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            setLanguage('fr');
          }}
          aria-pressed={
            language === 'fr'
          }
        >
          FR
        </button>

        <button
          type="button"
          className={[
            'appHeader__languageButton',
            language === 'en'
              ? 'appHeader__languageButton--active'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            setLanguage('en');
          }}
          aria-pressed={
            language === 'en'
          }
        >
          EN
        </button>
      </div>
    </header>
  );
};

export default AppHeader;