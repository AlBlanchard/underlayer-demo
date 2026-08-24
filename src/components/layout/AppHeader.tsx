import { useLanguage } from '@/i18n/useLanguage';

const AdminHeader = () => {
  const {
    language,
    setLanguage,
  } = useLanguage();

  
  return (
    <header className="adminHeader">
      <span className="adminHeader__brand">
        Underlayer
      </span>

      <div
        className="adminHeader__languages"
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

export default AdminHeader;