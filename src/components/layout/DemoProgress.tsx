import type { DemoStatus } from '@/types/demo';

interface DemoStep {
  label: string;
  statuses: readonly DemoStatus[];
}

const STEPS: readonly DemoStep[] = [
  {
    label: 'Connect',
    statuses: [
      'waiting-for-viewer',
      'viewer-connected',
    ],
  },
  {
    label: 'Deliver',
    statuses: [
      'encoding',
      'content-ready',
      'waiting-for-upload',
    ],
  },
  {
    label: 'Analyse',
    statuses: ['analysing'],
  },
  {
    label: 'Identify',
    statuses: ['identified'],
  },
];

const getCurrentStep = (
  status: DemoStatus,
) => {
  const index = STEPS.findIndex((step) =>
    step.statuses.includes(status),
  );

  return Math.max(index, 0);
};

const DemoProgress = ({
  status,
}: { status: DemoStatus }) => {
  const currentStep = getCurrentStep(status);

  return (
    <nav
      className="demoProgress"
      aria-label="Demo progress"
    >
      <ol className="demoProgress__list">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.label}
              className={[
                'demoProgress__step',
                isCompleted
                  ? 'demoProgress__step--completed'
                  : '',
                isCurrent
                  ? 'demoProgress__step--current'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={
                isCurrent ? 'step' : undefined
              }
            >
              <span className="demoProgress__marker">
                {isCompleted ? '✓' : index + 1}
              </span>

              <span className="demoProgress__label">
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default DemoProgress;