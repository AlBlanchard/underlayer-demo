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