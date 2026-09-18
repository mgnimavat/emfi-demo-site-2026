import Image from "next/image";
import { home } from "@/content/home";

function FanLines() {
  const ends = [28, 92, 156, 220];

  return (
    <svg
      viewBox="0 0 88 248"
      className="emfi-chain-fan hidden h-62 w-16 shrink-0 overflow-visible md:block lg:w-20"
      fill="none"
      aria-hidden
    >
      {ends.map((y, i) => {
        const d = `M1 124 C 34 124 40 ${y} 87 ${y}`;
        return (
          <g key={y}>
            <path d={d} className="emfi-chain-path-glow" />
            <path d={d} className="emfi-chain-path" />
            <path
              d={d}
              pathLength="1"
              className="emfi-chain-energy-path"
              style={{ animationDelay: `${0.35 + i * 0.14}s` }}
            />
            <circle r="2.4" className="emfi-chain-spark">
              <animateMotion
                dur="2.1s"
                begin={`${0.35 + i * 0.14}s`}
                repeatCount="indefinite"
                path={d}
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function EnergyLink({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      className={
        vertical
          ? "emfi-chain-link emfi-chain-link-v mx-auto h-8 w-px md:hidden"
          : "emfi-chain-link mx-1 hidden h-0.5 w-8 md:block lg:w-12"
      }
    >
      <span className="emfi-chain-energy" />
    </span>
  );
}

export function RelationshipMap() {
  return (
    <div className="emfi-chain relative flex min-w-0 items-center justify-center md:justify-end">
      <div className="relative flex w-full min-w-0 flex-col items-center gap-6 md:flex-row md:items-center md:gap-0">
        <div className="flex flex-col items-center md:contents">
          <div className="emfi-chain-node flex h-20 w-20 shrink-0 items-center justify-center self-center rounded-lg lg:h-22 lg:w-22">
            <span className="font-heading text-base font-bold leading-none tracking-[-0.03em] text-ink-inverse">
              Client
            </span>
          </div>
          <EnergyLink />
          <EnergyLink vertical />
        </div>

        <div className="relative z-10 flex shrink-0 flex-col items-center self-center">
          <div className="emfi-chain-hub flex h-24 w-24 items-center justify-center rounded-lg px-2.5 lg:h-29 lg:w-29">
            <Image
              src="/brand/emfi-logo.svg"
              alt="emfi"
              width={131}
              height={53}
              className="h-8 w-auto lg:h-10"
              unoptimized
            />
          </div>
          <p className="pointer-events-none absolute top-full mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
            {home.chainHubCaption}
          </p>
        </div>

        <EnergyLink vertical />
        <FanLines />

        <ul className="flex min-w-0 w-full flex-col gap-3 md:max-w-56">
          {home.chainInfra.map((item) => (
            <li key={item.name} className="emfi-chain-node rounded-lg px-4 py-2.5">
              <p className="text-[12px] leading-4 text-ink-inverse-muted">{item.role}</p>
              <p className="mt-0.5 font-heading text-md font-bold tracking-[-0.02em] text-ink-inverse">
                {item.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
