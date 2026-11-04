"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./legal.module.css";

type DocumentLink = { label: string; href: string };

export function LegalDocumentSearch({
  current,
  documents,
}: {
  current: string;
  documents: readonly DocumentLink[];
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.flatMap((doc, index) =>
      doc.label !== current && doc.label.toLowerCase().includes(q) ? [{ ...doc, index }] : [],
    );
  }, [current, documents, query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => setActive(0), [query]);

  const openAt = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={styles.search} ref={rootRef}>
      <div className={styles.control} data-open={open}>
        <Search size={16} aria-hidden />
        <input
          id={`${listId}-input`}
          role="combobox"
          aria-label="Search legal documents"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={current}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!options.length && event.key !== "Escape") return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((index) => Math.min(index + 1, options.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Escape") setOpen(false);
            if (event.key === "Enter" && open && options[active]) {
              event.preventDefault();
              openAt(options[active].href);
            }
          }}
        />
        <button type="button" className={styles.toggle} data-open={open} aria-label="Show legal documents" onClick={() => setOpen((value) => !value)}>
          <ChevronDown size={16} aria-hidden />
        </button>
      </div>
      {open ? (
        <ul id={listId} role="listbox" className={styles.panel}>
          {options.length === 0 ? (
            <li className={styles.empty}>No matching documents</li>
          ) : (
            options.map((doc, index) => (
              <li key={doc.href} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => openAt(doc.href)}
                >
                  <span>{String(doc.index + 1).padStart(2, "0")}</span>
                  {doc.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
