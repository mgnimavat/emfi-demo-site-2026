import { cn } from "@/lib/cn";

export function LightField({
  tone = "inverse",
  className,
}: {
  tone?: "inverse" | "page";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("emfi-light", tone === "page" && "emfi-light-page", className)}
    >
      <span className="emfi-light-glow-a" />
      <span className="emfi-light-glow-b" />
      <span className="emfi-light-sheen" />
    </span>
  );
}
