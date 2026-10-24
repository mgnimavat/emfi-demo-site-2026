import { Button } from "@/components/ui/button";

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

export function SectionCopy({
  title,
  lead,
  body,
  action,
}: {
  title: string;
  lead?: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <h2 style={{ fontSize: "clamp(40px,4.6vw,72px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-.05em", color: "#FFFFFF" }}>{title}</h2>
      {lead ? <p style={{ marginTop: 18, fontSize: "clamp(20px,1.7vw,24px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.25, color: "#FFFFFF" }}>{lead}</p> : null}
      <p style={{ marginTop: lead ? 12 : 18, maxWidth: 440, fontSize: 17, lineHeight: 1.6, color: "#CBD2E8", textWrap: "pretty" }}>{body}</p>
      {action ? (
        <div style={{ marginTop: 28 }}>
          <Button href={action.href} variant="circle">{action.label}</Button>
        </div>
      ) : null}
    </div>
  );
}
