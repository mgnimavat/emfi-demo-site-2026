import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { scoreSettlementQuestionnaire } from '../src/lib/settlement-questionnaire.ts';

const readQuiz = (locale) => JSON.parse(readFileSync(
  new URL(`../src/content/locales/${locale}/settlement.json`, import.meta.url), 'utf8'
)).questionnaire;
const quiz = readQuiz('en');
const answerByScore = (score) => Object.fromEntries(quiz.questions.map((question) => [
  question.id, question.options.findIndex((option) => option.score === score),
]));

test('clear arrangements produce low indications in all three areas', () => {
  const results = scoreSettlementQuestionnaire(quiz.questions, answerByScore(0), quiz.groups);
  assert.deepEqual(results.map(({ score, maximum, level }) => ({ score, maximum, level })),
    Array.from({ length: 3 }, () => ({ score: 0, maximum: 4, level: 'low' })));
});

test('high exposure answers score correctly even when answer positions differ', () => {
  const results = scoreSettlementQuestionnaire(quiz.questions, answerByScore(2), quiz.groups);
  assert.ok(results.every((result) => result.score === 4 && result.level === 'high'));
});

test('uncertain answers produce medium indications and changing answers updates the result', () => {
  const answers = answerByScore(1);
  assert.ok(scoreSettlementQuestionnaire(quiz.questions, answers, quiz.groups)
    .every((result) => result.level === 'medium'));
  const first = quiz.questions[0];
  answers[first.id] = first.options.findIndex((option) => option.score === 2);
  assert.equal(scoreSettlementQuestionnaire(quiz.questions, answers, quiz.groups)[0].level, 'high');
});

test('restart clears scores and translations preserve the same assessment', () => {
  assert.ok(scoreSettlementQuestionnaire(quiz.questions, {}, quiz.groups)
    .every((result) => result.score === 0 && result.maximum === 0));
  const answers = answerByScore(2);
  const expected = scoreSettlementQuestionnaire(quiz.questions, answers, quiz.groups);
  for (const locale of ['es', 'ar']) {
    const translated = readQuiz(locale);
    assert.deepEqual(scoreSettlementQuestionnaire(translated.questions, answers, translated.groups), expected);
  }
});
