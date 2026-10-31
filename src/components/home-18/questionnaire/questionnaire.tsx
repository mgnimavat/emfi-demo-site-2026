'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { questionnaire as copy } from '@/content/home-16-questionnaire';
import { contact } from '@/content/contact';
import styles from './questionnaire.module.css';

const questionTitles = [
  'Your Annual Custody Cost',
  'Your monthly minimum fee',
  'Your minimum contract term',
  'Frequency of settlement status',
  'Middleman between you and your assets',
  'Segregated depository account',
] as const;
const questions = copy.questions.map((question, index) => ({
  ...question,
  title: questionTitles[index] ?? question.title,
}));
const placeholders: Record<string, string> = { firm: 'Organization', email: 'Email Address', telephone: 'Phone' };
const fields = copy.fields.map((field) => ({
  ...field,
  label: field.name === 'telephone' ? 'Phone' : field.label,
  placeholder: placeholders[field.name] ?? field.placeholder,
}));
const questionCount = questions.length;
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
    const details = fields.map((field) =>
      `${field.label}: ${String(data.get(field.name) ?? '').trim()}`
    );
    const responses = questions.map((item) =>
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
          <h2 className={`${styles.intro} ${styles.promptIntro} ${isContact ? styles.inactive : ''}`} aria-hidden={isContact}>
            <span className={styles.headlineLine}>Is Your</span>
            <span className={styles.headlineLine}>current</span>
            <span className={styles.headlineLine}>infrastructure</span>
            <span className={styles.headlineLine}>a bit <span className={styles.accent}>extra</span><span className={styles.accentMark}>?</span></span>
          </h2>
          <h2 id="home-16-contact-heading" ref={contactHeading} tabIndex={-1} className={`${styles.intro} ${styles.promptIntro} ${styles.contactIntro} ${!isContact ? styles.inactive : ''}`} aria-hidden={!isContact}>
            <span className={styles.headlineLine}>{copy.resultTitle}</span>
            <span className={styles.headlineLine}><span className={styles.accent}>{resultWord}</span>{resultMark && <span className={styles.accentMark}>{resultMark}</span>}</span>
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
          {questions.map((question, index) => (
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
                {fields.map((field) => (
                  <input key={field.name} aria-label={field.label} name={field.name} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} required={field.required} />
                ))}
              </div>
              {draftReady && <p role="status" className={styles.description}>{copy.draftNotice}</p>}
              <div className={styles.actions}>
                <button type="button" className={styles.back} onClick={() => goToStep(questionCount - 1)}><ArrowLeft aria-hidden="true" />{copy.backToQuestions}</button>
                <button type="submit" className={styles.next}>{copy.submit}<ArrowRight aria-hidden="true" /></button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
