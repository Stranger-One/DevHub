export interface CompletionRule {
  key: string;
  label: string;
  weight: number;
  completed: boolean;
}

export interface ProfileCompletionResult {
  percentage: number;
  completedSections: string[];
  incompleteSections: string[];
  isComplete: boolean;
}

export const calculateProfileCompletion = (
  rules: CompletionRule[],
): ProfileCompletionResult => {
  const totalWeight = rules.reduce((total, rule) => total + rule.weight, 0);

  const completedWeight = rules.reduce(
    (total, rule) => total + (rule.completed ? rule.weight : 0),
    0,
  );

  const percentage =
    totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);

  const completedSections = rules
    .filter((rule) => rule.completed)
    .map((rule) => rule.key);

  const incompleteSections = rules
    .filter((rule) => !rule.completed)
    .map((rule) => rule.key);

  return {
    percentage,
    completedSections,
    incompleteSections,
    isComplete: percentage === 100,
  };
};
