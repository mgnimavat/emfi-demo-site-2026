'use client';

import { ChevronDown, FileSearch, Search, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  fundDetailFields,
  fundSearchMaxLength,
  fundSearchMinLength,
  type FundSearchOption,
} from '@/lib/fund-search';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import { useFundSearch } from '@/lib/use-fund-search';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import styles from './WealthFundSearch.module.css';

export const WealthFundSearch = ({ copy }: { copy: WealthCopy['redesign']['fundSearch'] }) => {
  const { locale } = useServiceLocale();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [selected, setSelected] = useState<FundSearchOption | null>(null);
  const expanded = open && !selected;
  const { state, retry } = useFundSearch(query, expanded);
  const results = state.status === 'ready' ? state.results : [];
  const activeId = expanded && results[active] ? `${id}-option-${active}` : undefined;
  const hint = copy.hint.replace('{min}', new Intl.NumberFormat(locale).format(fundSearchMinLength));
  const status = state.status === 'loading' ? copy.loading
    : state.status === 'error' ? copy.unavailable
    : state.status === 'ready' ? results.length ? copy.resultsReady : copy.empty
    : hint;

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const select = (option: FundSearchOption) => {
    if (state.status !== 'ready') return;
    setSelected(option);
    close();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (selected) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      if (!results.length) return;
      const down = event.key === 'ArrowDown';
      setActive((current) => current < 0
        ? down ? 0 : results.length - 1
        : Math.max(0, Math.min(results.length - 1, current + (down ? 1 : -1))));
    } else if (event.key === 'Enter' && expanded && results[active]) {
      event.preventDefault();
      select(results[active]);
    }
  };

  const selectedDetails = selected ? fundDetailFields.flatMap((field) => {
    const value = selected[field];
    if (!value) return [];
    const displayValue = field === 'incomeTreatment' && (value === 'ACC' || value === 'INC')
      ? copy.incomeLabels[value] : value;
    return [{ field, value: displayValue }];
  }) : [];

  return (
    <section id="fund-search" className={styles.section} aria-labelledby="fund-search-heading">
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.intro}>
            <h2 id="fund-search-heading" className={styles.title}>{copy.title}</h2>
            <p className={styles.introCopy}>{copy.description}</p>
          </div>

          <div className={styles.searchPanel} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) close();
          }}>
            <label htmlFor={`${id}-input`} className={styles.label}>{copy.label}</label>
            <div className={styles.search}>
              <div className={styles.field}>
                <Search size={20} aria-hidden="true" className={styles.searchIcon} />
                <input
                  ref={input}
                  id={`${id}-input`}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={expanded}
                  aria-controls={expanded ? `${id}-list` : undefined}
                  aria-activedescendant={activeId}
                  aria-describedby={`${id}-hint`}
                  autoComplete="off"
                  dir="auto"
                  spellCheck={false}
                  maxLength={fundSearchMaxLength}
                  placeholder={copy.placeholder}
                  value={selected?.name ?? query}
                  onFocus={() => setOpen(true)}
                  onClick={() => setOpen(true)}
                  onKeyDown={onKeyDown}
                  onChange={(event) => {
                    setSelected(null);
                    setQuery(event.target.value);
                    setActive(-1);
                    setOpen(true);
                  }}
                />
                <button
                  type="button"
                  className={styles.toggle}
                  aria-label={selected ? copy.clear : expanded ? copy.hide : copy.show}
                  onClick={() => {
                    if (selected) {
                      setSelected(null);
                      setQuery('');
                    }
                    input.current?.focus();
                    if (expanded) close();
                    else setOpen(true);
                  }}
                >
                  {selected ? <X size={18} aria-hidden="true" />
                    : <ChevronDown size={19} aria-hidden="true" data-open={expanded} />}
                </button>
              </div>

              {expanded && (
                <div className={styles.dropdown}>
                  <div className={results.length ? 'sr-only' : styles.message} role="status">{status}</div>
                  {results.length > 0 && (
                    <div className={styles.listHeader} aria-hidden="true">
                      <span>{copy.fundName}</span>
                      <span>{copy.isin}</span>
                    </div>
                  )}
                  <ul id={`${id}-list`} role="listbox" aria-label={copy.label}
                    aria-busy={state.status === 'loading'} className={styles.options} hidden={!results.length}>
                    {results.map((fund, index) => (
                      <li id={`${id}-option-${index}`} key={fund.id} role="option"
                        aria-selected={active === index} className={styles.option}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => select(fund)}>
                        <span className={styles.fundName}><bdi>{fund.name}</bdi></span>
                        {fund.isin ? (
                          <span className={styles.code}>
                            <span className="sr-only">{copy.isin}{' '}</span>
                            <bdi dir="ltr">{fund.isin}</bdi>
                          </span>
                        ) : <span className={styles.emptyCode} aria-hidden="true">—</span>}
                      </li>
                    ))}
                  </ul>
                  {state.status === 'error' && (
                    <button type="button" className={styles.retry} onClick={() => {
                      input.current?.focus();
                      retry();
                    }}>{copy.retry}</button>
                  )}
                  {state.status === 'ready' && state.hasMore && (
                    <p className={styles.dropdownFooter}>{copy.refine}</p>
                  )}
                </div>
              )}
            </div>

            <p id={`${id}-hint`} className="sr-only">{hint}</p>
            <div className={styles.selection}>
              <h3 id={`${id}-details`} className={styles.detailsTitle}>{copy.detailsTitle}</h3>
              <div
                className={styles.details}
                data-empty={!selected}
                role="status"
                aria-atomic="true"
                aria-labelledby={`${id}-details`}
                tabIndex={selected ? 0 : undefined}
              >
                {selected ? <>
                  <strong><bdi>{selected.name}</bdi></strong>
                  {selectedDetails.length > 0 && (
                    <dl>
                      {selectedDetails.map(({ field, value }) => (
                        <div key={field} data-identifier={field === 'isin' || field === 'lei'}>
                          <dt>{copy[field]}</dt>
                          <dd><bdi>{value}</bdi></dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </> : <>
                  <span className={styles.emptyIcon} aria-hidden="true"><FileSearch size={24} /></span>
                  <p>{copy.detailsEmpty}</p>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
