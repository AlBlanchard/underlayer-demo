import Button from '@/components/common/Button';
import { useLanguage } from '@/i18n/useLanguage';

interface RoleTransitionProps {
  onContinue: () => void;
  onBack: () => void;
}

const RoleTransition = ({ onContinue, onBack }: RoleTransitionProps) => {
  const { t } = useLanguage();

  return (
    <section className="roleTransition">
      <div className="roleTransition__content">
        <span className="roleTransition__eyebrow">{t.user.roleTransition.eyebrow}</span>

        <h1 className="roleTransition__title">{t.user.roleTransition.title}</h1>

        <p className="roleTransition__description">{t.user.roleTransition.description}</p>

        <div className="roleTransition__actions">
          <Button type="button" onClick={onContinue}>
            {t.user.roleTransition.continue}
          </Button>

          <button type="button" className="roleTransition__back backButton" onClick={onBack}>
            {t.user.roleTransition.back}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoleTransition;
