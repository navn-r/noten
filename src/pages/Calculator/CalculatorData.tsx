export enum CalculatorKey {
  current = 'current',
  weight = 'weight',
  goal = 'goal',
}

export type CalculatorData<T> = { [key in CalculatorKey]: T };

export const DefaultData: CalculatorData<number> = {
  current: 69,
  weight: 8.832,
  goal: 100,
} as const;

export const Prompts: CalculatorData<string> = {
  current: 'Enter Current Average',
  weight: 'Enter Mark Weight',
  goal: 'Enter Desired Average',
} as const;

export const Messages: CalculatorData<string> = {
  current: 'What is your average right now?',
  weight: 'How much is the mark weighed at?',
  goal: 'What average do you want?',
} as const;
