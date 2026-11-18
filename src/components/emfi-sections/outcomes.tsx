'use client';

import { useServiceLocale } from '@/ui/hooks/useServiceLocale';

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./sections.module.css";

export function OutcomeRow({ items }: { items: readonly { label: string; opacity: number }[] }) {
  const { t } = useServiceLocale();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 0" }}>
      {items.map((item, index) => {
        const ruled = index < items.length - 1;
        return (
          <strong
            key={t(item.label)}
            style={{
              paddingRight: ruled ? 18 : undefined,
              marginRight: ruled ? 18 : undefined,
              borderRight: ruled ? "1px solid rgba(162,194,253,.3)" : undefined,
              flex: "none",
              whiteSpace: "nowrap",
              fontSize: "clamp(15px,1.3vw,18px)",
              fontWeight: 800,
              color: "#FFFFFF",
              opacity: item.opacity,
            }}
          >
            {t(item.label)}
          </strong>
        );
      })}
    </div>
  );
}

const TWO_LINE_BODIES = [
  ["Fewer unnecessary intermediaries.", "A more direct route to market."],
  ["Fewer intermediaries.", "Fewer handovers."],
  ["Technology that works.", "People who respond."],
  ["Tech that works.", "People who respond."],
  ["Institutional safeguards.", "Clear accountability."],
] as const;

function bodyLines(body: string) {
  const normalized = body.replace(/\s+/g, " ").trim();
  const match = TWO_LINE_BODIES.find(([first, second]) => normalized === `${first} ${second}`);
  return match ? [...match] : body.split("\n");
}

function BodyText({ body, color, centered = false, className, split = false }: { body: string; color: string; centered?: boolean; className?: string; split?: boolean }) {
  const { t } = useServiceLocale();
  return (
    <p
      className={[split ? styles.sectionBody : "", className].filter(Boolean).join(" ") || undefined}
      style={
        split
          ? { marginInline: centered ? "auto" : undefined, color, textAlign: centered ? "center" : undefined }
          : { marginTop: 0, maxWidth: 440, marginInline: centered ? "auto" : undefined, fontSize: 17, lineHeight: 1.6, color, textWrap: "pretty", textAlign: centered ? "center" : undefined }
      }
    >
      {bodyLines(t(body)).flatMap((line, index) => (index === 0 ? [t(line)] : [<br key={index} />, t(line)]))}
    </p>
  );
}

export function SectionCopy({
  title,
  index,
  lead,
  body,
  action,
  tone = "dark",
  align = "start",
  eyebrow,
  plainEyebrow = false,
  origin = false,
}: {
  title: string;
  index?: string;
  lead?: string;
  body?: string;
  action?: { href: string; label: string };
  tone?: "dark" | "light";
  align?: "start" | "center";
  eyebrow?: string;
  plainEyebrow?: boolean;
  origin?: boolean;
}) {
  const { t, localize } = useServiceLocale();
  const light = tone === "light";
  const centered = align === "center";
  const titleColor = light ? "#071832" : "#FFFFFF";
  const bodyColor = light ? "#24344b" : "#CBD2E8";

  return (
    <div className={styles.sectionCopy} style={{ minWidth: 0, width: centered ? "100%" : undefined, textAlign: centered ? "center" : undefined }}>
      {eyebrow ? (
        <p className={plainEyebrow ? `${styles.eyebrow} ${styles.eyebrowPlain}` : styles.eyebrow} data-why-origin={origin ? "" : undefined} style={{ color: plainEyebrow ? "#071932" : light ? "#2a578f" : undefined, justifyContent: centered ? "center" : undefined }}>
          {plainEyebrow ? null : <span className={styles.eyebrowMark} aria-hidden="true" />}
          <span>{t(eyebrow)}</span>
        </p>
      ) : null}
      <h2 className={index ? `${styles.sectionTitle} ${styles.sectionTitleIndexed}` : styles.sectionTitle} style={{ color: titleColor }}>
        {index ? (
          <>
            <span className={styles.sectionIndex}>{index}</span>
            <span className={styles.sectionIndexRule} aria-hidden="true" />
            <span className={styles.sectionIndexLabel}>{t(title)}</span>
          </>
        ) : (
          t(title)
        )}
      </h2>
      {lead ? (
        <p className={styles.sectionLead} style={{ color: titleColor }}>
          {t(lead).split("\n").flatMap((line, index) => (index === 0 ? [line] : [<br key={index} />, line]))}
        </p>
      ) : null}
      {body ? (
        lead ? (
          <BodyText body={body} color={bodyColor} centered={centered} split />
        ) : (
          <div style={{ marginTop: 18 }}>
            <BodyText body={body} color={bodyColor} centered={centered} />
          </div>
        )
      ) : null}
      {action ? (
        <div className="section-bottom-action" style={{ marginTop: 28, display: centered ? "flex" : undefined, justifyContent: centered ? "center" : undefined }}>
          <Button href={localize(action.href)} variant="circle">{t(action.label)}</Button>
        </div>
      ) : null}
    </div>
  );
}

export function SectionAction({ href, label, align = "center" }: { href: string; label: string; align?: "start" | "center" }) {
  const { t, localize } = useServiceLocale();
  return (
    <div className="section-bottom-action" style={{ display: "flex", justifyContent: align === "start" ? "flex-start" : "center", width: align === "start" ? "100%" : undefined }}>
      <Button href={localize(href)} variant="circle">{t(label)}</Button>
    </div>
  );
}

export function SectionFooterBody({ body, cueHref }: { body: string; tone?: "dark" | "light"; cueHref?: string }) {
  const { t, localize } = useServiceLocale();
  return (
    <div className={cueHref ? "section-bottom-action section-bottom-action-row" : "section-bottom-action"} style={cueHref ? undefined : { display: "flex", justifyContent: "center" }}>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#071932", textAlign: "center", whiteSpace: "nowrap" }}>
        {t(body.replace(/\s+/g, " ").trim())}
      </p>
      {cueHref ? (
        <a className={`${styles.heroCue} ${styles.heroCueOnLight} section-bottom-cue`} href={localize(cueHref)}>
          <span className="section-bottom-cue-label"><span>{t("Learn More")}</span></span>
          <ArrowRight size={16} strokeWidth={1.75} className={styles.heroCueLearnArrow} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}
