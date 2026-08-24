export type DemoStep =
  | 'identity'
  | 'preparing'
  | 'content'
  | 'role-transition'
  | 'upload'
  | 'analysing'
  | 'result';

  export const PREVIOUS_DEMO_STEP: Partial<
  Record<DemoStep, DemoStep>
> = {
  'role-transition': 'content',
  upload: 'role-transition',
  result: 'upload',
};

export const getDemoProgressIndex = (
  step: DemoStep,
): number => {
  switch (step) {
    case 'identity':
      return 0;

    case 'preparing':
    case 'content':
      return 1;

    case 'role-transition':
      return 2;

    case 'upload':
    case 'analysing':
      return 3;

    case 'result':
      return 4;
  }
};