import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { HeroAtmosphere } from "@/components/sections/hero-atmosphere";
import { HeroTypedLastWord } from "@/components/sections/hero-rotating-text";
import { cn } from "@/lib/cn";

function splitHeroTitle(titleLines: string[]) {
  if (titleLines.length >= 2) {
    return {
      boldLines: titleLines.slice(0, -1),
      lastLine: titleLines[titleLines.length - 1] ?? "",
    };
  }

  const line = titleLines[0] ?? "";
  const sentences = line.split(/(?<=\.)\s+/).filter(Boolean);
  if (sentences.length >= 2) {
    return {
      boldLines: [sentences.slice(0, -1).join(" ")],
      lastLine: sentences[sentences.length - 1] ?? "",
    };
  }

  return {
    boldLines: [] as string[],
    lastLine: line,
  };
}

export function PageHero({
  title,
  body,
  lead,
  children,
  visual,
  visualOverlay = false,
  visualWide = false,
  className,
  rotatingWords,
}: {
  title: string;
  body?: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  visual?: React.ReactNode;
  visualOverlay?: boolean;
  visualWide?: boolean;
  className?: string;
  /** Optional alternate last words. Defaults to the headline's last word. */
  rotatingWords?: readonly string[];
}) {
  const titleLines = title.split("\n").filter(Boolean);
  const { boldLines, lastLine } = splitHeroTitle(titleLines);

  const copy = (
    <FadeIn className={visualOverlay ? "relative z-10" : undefined}>
      {lead}
      <h1
        className={cn(
          "text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink md:text-6xl lg:text-7xl",
          visual && !visualOverlay ? "max-w-none" : "max-w-5xl",
        )}
        aria-label={title.replace(/\n/g, " ")}
      >
        {boldLines.map((line) => (
          <span key={line} className="mt-1 block first:mt-0">
            {line}
          </span>
        ))}
        <HeroTypedLastWord
          text={lastLine}
          words={rotatingWords}
          className={cn(boldLines.length && "mt-1")}
        />
      </h1>
      {body ? (
        <p
          className={cn(
            "mt-5 text-lg leading-8 text-ink-secondary",
            visual && !visualOverlay ? "max-w-none" : "max-w-2xl",
          )}
        >
          {body}
        </p>
      ) : null}
      {children}
    </FadeIn>
  );

  return (
    <section className={cn("relative flex min-h-[29.75rem] items-center overflow-hidden border-b border-line bg-page", className)}>
      <HeroAtmosphere compact sign={!visual} />
      <Container className="relative w-full py-12 lg:py-16">
        {visual && !visualOverlay ? (
          <div
            className={cn(
              "grid items-center gap-8 lg:gap-10",
              visualWide
                ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)]"
                : "lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]",
            )}
          >
            {copy}
            <FadeIn delay={0.14}>{visual}</FadeIn>
          </div>
        ) : (
          copy
        )}
      </Container>
      {visual && visualOverlay ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(48%,34rem)] items-center justify-center overflow-hidden md:flex">
          <FadeIn delay={0.14} className="flex h-[88%] w-full items-center justify-center">
            {visual}
          </FadeIn>
        </div>
      ) : null}
    </section>
  );
}

