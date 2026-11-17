'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { scoreSettlementQuestionnaire } from '@/lib/settlement-questionnaire';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import home from '@/components/home/questionnaire/questionnaire.module.css';
import styles from './SettlementQuestionnaireSection.module.css';

export const SettlementQuestionnaireSection = ({ copy }: { copy: SettlementCopy['questionnaire'] }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const heading = useRef<HTMLSpanElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const { localize } = useServiceLocale();
  const complete = step === copy.questions.length;
  const question = copy.questions[step];
  const category = copy.groups.find((group) => group.id === question?.group);
  const results = scoreSettlementQuestionnaire(copy.questions, answers, copy.groups);
  const highest = results.reduce((top, group) => group.score > top.score ? group : top, results[0]);
  const priority = copy.groups.find((group) => group.id === highest.id);

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    requestAnimationFrame(() => {
      const target = nextStep === copy.questions.length ? resultHeading.current : heading.current;
      target?.focus({ preventScroll: true });
    });
  };

  const restart = () => {
    setAnswers({});
    goToStep(0);
  };

  return (
    <section id="say-less" className={`${home.section} ${styles.section}`}
      aria-labelledby="settlement-quiz-heading">
      <div className={home.card}>
        <div className={styles.introduction}>
          <h2 id="settlement-quiz-heading" className={styles.title}>{copy.title}</h2>
          <p className={styles.description}>{copy.description}</p>
        </div>
        <div className={`${home.questionCard} ${styles.questionCard}`}>
          <div className={home.progressCorner}>
            {!complete ? <span className={styles.category}>{category?.label}</span> : null}
            <progress className={home.progress} value={complete ? step : step + 1}
              max={copy.questions.length} aria-label={copy.progressLabel} />
            <span className={home.stepNumber} aria-live="polite">
              {complete ? step : step + 1} / {copy.questions.length}
            </span>
          </div>
          {!complete ? (
            <>
              <div className={home.panels}>
                {copy.questions.map((item, index) => (
                  <div key={item.id} className={`${home.panel} ${step !== index ? home.inactive : ''}`}
                    inert={step !== index} aria-hidden={step !== index}>
                    <fieldset className={home.question}>
                      <legend className={home.legend}>
                        <span ref={step === index ? heading : undefined} role="heading" aria-level={3}
                          tabIndex={-1} className={home.questionTitle}>{item.title}</span>
                      </legend>
                      <div className={home.options}>
                        {item.options.map((option, optionIndex) => (
                          <label key={option.label} className={home.option}>
                            <input type="radio" name={item.id} value={optionIndex}
                              checked={answers[item.id] === optionIndex}
                              onClick={() => {
                                if (answers[item.id] === optionIndex) goToStep(index + 1);
                              }}
                              onChange={() => {
                                setAnswers((current) => ({ ...current, [item.id]: optionIndex }));
                                goToStep(index + 1);
                              }} />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ))}
              </div>
              <div className={home.actions}>
                <button type="button" className={home.back} disabled={step === 0}
                  onClick={() => goToStep(step - 1)}><ArrowLeft aria-hidden="true" />{copy.back}</button>
              </div>
            </>
          ) : (
            <div className={styles.results}>
              <h3 ref={resultHeading} tabIndex={-1} className={home.questionTitle}>
                {copy.resultTitle} {priority?.label}
              </h3>
              {results.map((result) => {
                const group = copy.groups.find((item) => item.id === result.id);
                if (!group) return null;
                return (
                  <div key={result.id} className={styles.result}>
                    <div className={styles.resultHeader}><h4>{group.label}</h4><span>{copy.levels[result.level]}</span></div>
                    <progress value={result.score} max={result.maximum} aria-label={group.label} />
                    <p><strong>{group.title}.</strong> {group.body}</p>
                  </div>
                );
              })}
              <p className={styles.notice}>{copy.notice}</p>
              <div className={styles.resultActions}>
                <button type="button" className={home.back} onClick={restart}>
                  <RotateCcw size={14} aria-hidden="true" />{copy.restart}
                </button>
                <Link className={home.next} href={localize('/contact')}>{copy.contact}<ArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
