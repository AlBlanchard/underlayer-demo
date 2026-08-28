interface ProgressItem {
  id: string;
  label: string;
  role?: 'viewer' | 'creator';
}

interface DemoProgressProps {
  steps: readonly ProgressItem[];
  currentIndex: number;
  onNavigate?: (index: number) => void;
  navigationDisabled?: boolean;
  compact?: boolean;
}

const DemoProgress = ({
  steps,
  currentIndex,
  onNavigate,
  navigationDisabled = false,
  compact = false,
}: DemoProgressProps) => {
  return (
    <nav
      className={['demoProgress', compact ? 'demoProgress--compact' : ''].filter(Boolean).join(' ')}
      aria-label="Demo progress"
    >
      <ol className="demoProgress__list">
        {steps.map((step, index) => {
          const isCurrent = index === currentIndex;

          const isCompleted = index < currentIndex;

          const canNavigate = Boolean(onNavigate) && isCompleted && index !== 0 && !navigationDisabled;

          return (
            <li
              key={step.id}
              className={[
                'demoProgress__item',
                step.role ? `demoProgress__item--${step.role}` : '',
                isCurrent ? 'demoProgress__item--current' : '',
                isCompleted ? 'demoProgress__item--completed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                className="demoProgress__step"
                disabled={!canNavigate}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => {
                  if (canNavigate) {
                    onNavigate?.(index);
                  }
                }}
              >
                <span className="demoProgress__marker">{isCompleted ? '✓' : index + 1}</span>

                <span className="demoProgress__label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default DemoProgress;
