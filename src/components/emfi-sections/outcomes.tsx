import { Button } from "@/components/ui/button";
import styles from "./sections.module.css";

export function OutcomeRow({ items }: { items: readonly { label: string; opacity: number }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 0" }}>
      {items.map((item, index) => {
        const ruled = index < items.length - 1;
        return (
          <strong
            key={item.label}
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
            {item.label}
          </strong>
        );
      })}
    </div>
  );
}

const TWO_LINE_BODIES = [
  ["Fewer unnecessary intermediaries.", "A more direct route to market."],
  ["Technology that works.", "People who respond."],
] as const;

function bodyLines(body: string) {
  const normalized = body.replace(/\s+/g, " ").trim();
  const match = TWO_LINE_BODIES.find(([first, second]) => normalized === `${first} ${second}`);
  return match ? [...match] : body.split("\n");
}

export function SectionCopy({
  title,
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
  lead?: string;
  body: string;
  action?: { href: string; label: string };
  tone?: "dark" | "light";
  align?: "start" | "center";
  eyebrow?: string;
  plainEyebrow?: boolean;
  origin?: boolean;
}) {
  const light = tone === "light";
  const centered = align === "center";
  const titleColor = light ? "#071832" : "#FFFFFF";
  const bodyColor = light ? "#24344b" : "#CBD2E8";

  return (
    <div className={styles.sectionCopy} style={{ minWidth: 0, width: centered ? "100%" : undefined, textAlign: centered ? "center" : undefined }}>
      {eyebrow ? (
        <p className={plainEyebrow ? `${styles.eyebrow} ${styles.eyebrowPlain}` : styles.eyebrow} data-why-origin={origin ? "" : undefined} style={{ color: plainEyebrow ? "#071932" : light ? "#2a578f" : undefined, justifyContent: centered ? "center" : undefined }}>
          {plainEyebrow ? null : <span className={styles.eyebrowMark} aria-hidden="true" />}
          <span>{eyebrow}</span>
        </p>
      ) : null}
      <h2 className={styles.sectionTitle} style={{ color: titleColor }}>{title}</h2>
      {lead ? <p style={{ marginTop: 18, fontSize: "clamp(20px,1.7vw,24px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.25, color: titleColor }}>{lead}</p> : null}
      <p style={{ marginTop: lead ? 12 : 18, maxWidth: 440, marginInline: centered ? "auto" : undefined, fontSize: 17, lineHeight: 1.6, color: bodyColor, textWrap: "pretty" }}>{bodyLines(body).flatMap((line, index) => (index === 0 ? [line] : [<br key={index} />, line]))}</p>
      {action ? (
        <div className="section-bottom-action" style={{ marginTop: 28, display: centered ? "flex" : undefined, justifyContent: centered ? "center" : undefined }}>
          <Button href={action.href} variant="circle">{action.label}</Button>
        </div>
      ) : null}
    </div>
  );
}
