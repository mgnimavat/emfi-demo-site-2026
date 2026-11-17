type ScoredQuestion = {
  id: string;
  group: string;
  options: ReadonlyArray<{ score: number }>;
};

const indicationThresholds = { high: 0.6, medium: 0.3 } as const;

export const scoreSettlementQuestionnaire = (
  questions: ReadonlyArray<ScoredQuestion>,
  answers: Readonly<Record<string, number>>,
  groups: ReadonlyArray<{ id: string }>
) => groups.map(({ id }) => {
  let score = 0;
  let maximum = 0;
  questions.filter((question) => question.group === id).forEach((question) => {
    const selected = question.options[answers[question.id]];
    if (!selected) return;
    score += selected.score;
    maximum += Math.max(...question.options.map((option) => option.score));
  });
  const ratio = maximum ? score / maximum : 0;
  const level: 'high' | 'medium' | 'low' = ratio >= indicationThresholds.high ? 'high'
    : ratio >= indicationThresholds.medium ? 'medium' : 'low';
  return { id, score, maximum, level };
});
