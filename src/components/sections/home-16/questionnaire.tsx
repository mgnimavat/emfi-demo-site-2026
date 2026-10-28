'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { questionnaire as copy } from '@/content/home-16-questionnaire';
import { contact } from '@/content/contact';
import styles from './questionnaire.module.css';

const questionCount = copy.questions.length;
const titleBreak = copy.title.lastIndexOf(' a bit');
const accentWord = copy.accent.endsWith('?') ? copy.accent.slice(0, -1) : copy.accent;
const accentMark = copy.accent.endsWith('?') ? '?' : '';
const resultWord = copy.resultAccent.endsWith('.') ? copy.resultAccent.slice(0, -1) : copy.resultAccent;
const resultMark = copy.resultAccent.endsWith('.') ? '.' : '';

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

  const selectAnswer = (questionId: string, answer: string, nextStep: number) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    goToStep(nextStep);
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
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeadings}>
          <h2 className={`${styles.intro} ${isContact ? styles.inactive : ''}`} aria-hidden={isContact}>
            {copy.title.slice(0, titleBreak)}<br />
            <span className={styles.headingEnding}>
              {copy.title.slice(titleBreak + 1)} <span className={styles.accent}>{accentWord}</span>{accentMark && <span className={styles.accentMark}>{accentMark}</span>}
            </span>
          </h2>
          <h2 id="home-16-contact-heading" ref={contactHeading} tabIndex={-1} className={`${styles.intro} ${styles.contactIntro} ${!isContact ? styles.inactive : ''}`} aria-hidden={!isContact}>
            {copy.resultTitle}<br /><span className={styles.accent}>{resultWord}</span>{resultMark && <span className={styles.accentMark}>{resultMark}</span>}
          </h2>
          </div>
        </aside>
        <div className={styles.questionCard}>
        <div className={styles.progressCorner}>
          <progress className={styles.progress} value={progress} max={questionCount} aria-label="Questionnaire progress" />
          <span className={styles.stepNumber} aria-live="polite">{progress} / {questionCount}</span>
        </div>
        {/* Overlapping panels reserve the tallest step's space at every screen size. */}
        <div className={styles.panels}>
          {copy.questions.map((question, index) => (
            <div key={question.id} className={`${styles.panel} ${step !== index ? styles.inactive : ''}`} inert={step !== index} aria-hidden={step !== index}>
              <div>
                <fieldset className={styles.question}>
                  <legend className={styles.legend}>
                    <span ref={step === index ? heading : undefined} role="heading" aria-level={3} tabIndex={-1} className={styles.questionTitle}>{question.title}</span>
                  </legend>
                  <div className={styles.options}>
                    {question.options.map((option) => (
                      <label key={option} className={styles.option}>
                        <input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => selectAnswer(question.id, option, index + 1)} onClick={() => {
                          if (answers[question.id] === option) goToStep(index + 1);
                        }} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className={styles.actions}>
                  <button type="button" className={styles.back} disabled={index === 0} onClick={() => goToStep(index - 1)}><ArrowLeft aria-hidden="true" />{copy.back}</button>
                </div>
              </div>
            </div>
          ))}
          <div className={`${styles.panel} ${styles.contact} ${!isContact ? styles.inactive : ''}`} inert={!isContact} aria-hidden={!isContact}>
            <form aria-label="Let's talk" onSubmit={submitEnquiry}>
              <div className={styles.fields}>
                {copy.fields.map((field) => (
                  <input key={field.name} aria-label={field.label} name={field.name} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} required={field.required} />
                ))}
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.back} onClick={() => goToStep(questionCount - 1)}><ArrowLeft aria-hidden="true" />{copy.backToQuestions}</button>
                <button type="submit" className={styles.next}>{copy.submit}<ArrowUpRight aria-hidden="true" /></button>
              </div>
              {draftReady && <p role="status" className={styles.description}>{copy.draftNotice}</p>}
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
