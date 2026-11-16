'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { locales, type Locale } from '@/lib/i18n';
import styles from './LanguageSelect.module.css';

const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ar: 'العربية',
};

type LanguageSelectProps = {
  locale: Locale;
  label: string;
  disabled?: boolean;
  title?: string;
  onChange: (locale: Locale) => void;
};

export const LanguageSelect = ({
  locale,
  label,
  disabled = false,
  title,
  onChange,
}: LanguageSelectProps) => {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(locales.indexOf(locale));

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>(`[data-index="${activeIndex}"]`)?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && !disabled) {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : event.key === 'End' ? locales.length - 1 :
        !open ? locales.indexOf(locale) :
          (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + locales.length) % locales.length);
      setOpen(true);
    }
  };

  return (
    <div ref={root} className={styles.control} onKeyDown={handleKeyDown} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={trigger} id={`${id}-trigger`} type="button" className={styles.trigger}
        aria-label={`${label}: ${languageNames[locale]}`} aria-haspopup="listbox"
        aria-expanded={open} aria-controls={open ? `${id}-options` : undefined}
        disabled={disabled} title={title} onClick={() => {
          setActiveIndex(locales.indexOf(locale));
          setOpen(!open);
        }}>
        <span>{locale.toUpperCase()}</span>
        <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
      {open ? <div id={`${id}-options`} role="listbox" aria-label={label} className={styles.menu}>
        {locales.map((language, index) => (
          <button key={language} type="button" role="option" aria-selected={language === locale}
            tabIndex={activeIndex === index ? 0 : -1} data-index={index} className={styles.option}
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
              if (language !== locale) onChange(language);
            }}>
            <span className={styles.code}>{language.toUpperCase()}</span>
            <span lang={language} className={styles.name}>{languageNames[language]}</span>
            {language === locale ? <Check size={14} aria-hidden="true" /> : null}
          </button>
        ))}
      </div> : null}
    </div>
  );
};
