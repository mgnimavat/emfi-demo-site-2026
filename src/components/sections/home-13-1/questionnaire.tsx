'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { questionnaire as copy } from '@/content/home-13-1-questionnaire';
import { contact } from '@/content/contact';
import styles from './questionnaire.module.css';

const questionCount = copy.questions.length;

export const QuestionnaireSection = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draftReady, setDraftReady] = useState(false);
  const heading = useRef<HTMLSpanElement>(null);
  const contactHeading = useRef<HTMLHeadingElement>(null);
  const isContact = step === questionCount;
  const progress = isContact ? questionCount : step + 1;

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    requestAnimationFrame(() => {
      const target = nextStep === questionCount ? contactHeading.current : heading.current;
      target?.focus({ preventScroll: true });
    });
  };

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const details = copy.fields.map((field) =>
      `${field.label}: ${String(data.get(field.name) ?? '').trim()}`
    );
    const responses = copy.questions.map((item) =>
      `${item.title} ${answers[item.id] ?? copy.unanswered}`
    );
    const body = [...details, '', ...responses].join('\n');
    window.location.href = `mailto:${contact.locations[0].email}?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(body)}`;
    setDraftReady(true);
  };

  return (
    <section id="say-less" className={styles.section} aria-label="Review your current infrastructure">
      <div className={styles.card}>
        <div className={styles.progressCorner}>
          <progress className={styles.progress} value={progress} max={questionCount} aria-label="Questionnaire progress" />
          <span className={styles.stepNumber} aria-live="polite">{progress} / {questionCount}</span>
        </div>
        {/* Overlapping panels reserve the tallest step's space at every screen size. */}
        <div className={styles.panels}>
          {copy.questions.map((question, index) => (
            <div key={question.id} className={`${styles.panel} ${step !== index ? styles.inactive : ''}`} inert={step !== index} aria-hidden={step !== index}>
              <h2 className={styles.intro}>{copy.title}<br /><span>{copy.accent}</span></h2>
              <form onSubmit={(event) => { event.preventDefault(); goToStep(index + 1); }}>
                <fieldset className={styles.question}>
                  <legend className={styles.legend}>
                    <span ref={step === index ? heading : undefined} role="heading" aria-level={3} tabIndex={-1} className={styles.questionTitle}>{question.title}</span>
                  </legend>
                  <div className={styles.options}>
                    {question.options.map((option) => (
                      <label key={option} className={styles.option}>
                        <input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className={styles.actions}>
                  <button type="button" className={styles.back} disabled={index === 0} onClick={() => goToStep(index - 1)}><ArrowLeft aria-hidden="true" />{copy.back}</button>
                  <button type="submit" className={styles.next}>{index === questionCount - 1 ? copy.finish : copy.next}<ArrowRight aria-hidden="true" /></button>
                </div>
              </form>
            </div>
          ))}
          <div className={`${styles.panel} ${styles.contact} ${!isContact ? styles.inactive : ''}`} inert={!isContact} aria-hidden={!isContact}>
            <h2 ref={contactHeading} tabIndex={-1} className={styles.resultTitle}>{copy.resultTitle} <span>{copy.resultAccent}</span></h2>
            <form onSubmit={submitEnquiry}>
              <div className={styles.fields}>
                {copy.fields.map((field) => (
                  <input key={field.name} aria-label={field.label} name={field.name} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} required={field.required} />
                ))}
              </div>
              <div className={styles.contactActions}>
                <button type="submit" className={styles.next}>{copy.submit}<ArrowUpRight aria-hidden="true" /></button>
              </div>
              {draftReady && <p role="status" className={styles.description}>{copy.draftNotice}</p>}
            </form>
            <div className={styles.contactBack}><button type="button" className={styles.back} onClick={() => goToStep(questionCount - 1)}><ArrowLeft aria-hidden="true" />{copy.backToQuestions}</button></div>
          </div>
        </div>
      </div>
    </section>
  );
};
