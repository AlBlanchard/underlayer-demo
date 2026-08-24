import { useLanguage } from '@/i18n/useLanguage';

import type {
  DemoStep,
} from '../types/demo-flow';

interface DemoProgressProps {
  currentStep: DemoStep;
  onNavigate: (step: DemoStep) => void;
  navigationDisabled?: boolean;
}

interface ProgressStep {
  target: DemoStep;
  steps: readonly DemoStep[];
  role: 'viewer' | 'creator';
}

const PROGRESS_STEPS: readonly ProgressStep[] = [
  {
    target: 'identity',
    steps: ['identity'],
    role: 'viewer',
  },
  {
    target: 'content',
    steps: [
      'preparing',
      'content',
    ],
    role: 'viewer',
  },
  {
    target: 'role-transition',
    steps: ['role-transition'],
    role: 'creator',
  },
  {
    target: 'upload',
    steps: [
      'upload',
      'analysing',
    ],
    role: 'creator',
  },
  {
    target: 'result',
    steps: ['result'],
    role: 'creator',
  },
];

const DemoProgress = ({
  currentStep,
  onNavigate,
  navigationDisabled = false,
}: DemoProgressProps) => {
  const { t } = useLanguage();

  const labels = [
    t.user.progress.identity,
    t.user.progress.content,
    t.user.progress.creator,
    t.user.progress.analysis,
    t.user.progress.result,
  ];

  const currentIndex =
    PROGRESS_STEPS.findIndex(
      ({ steps }) =>
        steps.includes(currentStep),
    );

  return (
    <nav
      className="demoProgress"
      aria-label={`${t.user.progress.step} ${
        currentIndex + 1
      } ${t.user.progress.of} ${
        PROGRESS_STEPS.length
      }`}
    >
      <div className="demoProgress__current">
        <span>
          {t.user.progress.step}{' '}
          {currentIndex + 1}{' '}
          {t.user.progress.of}{' '}
          {PROGRESS_STEPS.length}
        </span>

        <strong>
          {labels[currentIndex]}
        </strong>
      </div>

      <ol className="demoProgress__list">
        {PROGRESS_STEPS.map(
          (progressStep, index) => {
            const isCurrent =
              index === currentIndex;

            const isCompleted =
              index < currentIndex;

            const isIdentity =
              progressStep.target ===
              'identity';

            const canNavigate =
              isCompleted &&
              !isIdentity &&
              !navigationDisabled;

            return (
              <li
                key={progressStep.target}
                className={[
                  'demoProgress__item',
                  `demoProgress__item--${progressStep.role}`,
                  isCurrent
                    ? 'demoProgress__item--current'
                    : '',
                  isCompleted
                    ? 'demoProgress__item--completed'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <button
                  type="button"
                  className="demoProgress__step"
                  disabled={!canNavigate}
                  aria-current={
                    isCurrent
                      ? 'step'
                      : undefined
                  }
                  onClick={() => {
                    if (canNavigate) {
                      onNavigate(
                        progressStep.target,
                      );
                    }
                  }}
                >
                  <span className="demoProgress__marker">
                    {isCompleted
                      ? '✓'
                      : index + 1}
                  </span>

                  <span className="demoProgress__label">
                    {labels[index]}
                  </span>
                </button>
              </li>
            );
          },
        )}
      </ol>
    </nav>
  );
};

export default DemoProgress;