import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "secondary" | "inverse" | "ghost" | "circle";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  showArrow?: boolean;
  as?: "span";
};

const variants = {
  primary:
    "border border-[color-mix(in_srgb,var(--color-blue-200)_55%,transparent)] bg-[var(--text-primary)] text-ink-inverse",
  outline: "border border-line bg-page text-ink hover:bg-subtle",
  secondary:
    "border border-brand bg-page text-brand hover:border-brand hover:bg-brand hover:text-ink-inverse",
  inverse: "bg-page text-ink hover:bg-subtle",
  ghost:
    "border border-line-inverse/40 bg-transparent text-ink-inverse hover:bg-ink-inverse/5",
};

function ButtonArrow() {
  return (
    <ArrowRight
      size={14}
      aria-hidden
      className="emfi-btn-arrow shrink-0 transition-transform duration-200 ease"
    />
  );
}

function CircleMark() {
  return (
    <span className="emfi-circle-btn-mark" aria-hidden="true">
      <ArrowRight size={16} strokeWidth={1.75} className="emfi-circle-btn-arrow" />
    </span>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
  showArrow = true,
  as,
}: ButtonProps) {
  const circle = variant === "circle";
  const classes = cn(
    circle
      ? "emfi-circle-btn"
      : "emfi-btn group inline-flex min-h-11 items-center justify-center gap-3 rounded-full px-5 py-3 text-[13px] font-semibold tracking-normal",
    circle ? undefined : variants[variant],
    className,
  );

  const content = circle ? (
    <>
      <span className="emfi-circle-btn-label">{children}</span>
      <CircleMark />
    </>
  ) : (
    <span className="emfi-btn-label">
      {children}
      {showArrow ? <ButtonArrow /> : null}
    </span>
  );

  const control =
    as === "span" ? (
      <span className={classes}>{content}</span>
    ) : href ? (
      <Link href={href} className={classes}>
        {content}
      </Link>
    ) : (
      <button type={type} onClick={onClick} className={classes}>
        {content}
      </button>
    );

  return <span className="emfi-btn-hit group inline-flex">{control}</span>;
}
