import { cn } from "@/lib/cn";

function fillLoop(items: readonly string[], min = 8) {
  const unit = [...items];
  while (unit.length < min) unit.push(...items);
  return [...unit, ...unit];
}

export function Marquee({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const loop = fillLoop(items);

  return (
    <div className={cn("overflow-hidden border-y border-line bg-page", className)}>
      <div className="emfi-marquee-track flex w-max items-center gap-10 py-4 md:gap-16">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-[11px] font-bold tracking-[0.16em] text-ink-secondary md:gap-16"
            aria-hidden={i >= loop.length / 2}
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    </div>
  );
}