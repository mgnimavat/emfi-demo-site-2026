import { home2 as home } from "@/content/home-2";
import { RelationshipMap } from "@/components/sections/home-2/relationship-map";

export function HeroFlowchart({ activeName }: { activeName?: string }) {
  return (
    <div className="emfi-hero-flowchart relative z-10 w-full rounded-[10px] border border-black/6 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.12),0_2px_10px_rgba(15,23,42,0.06)] md:px-6 md:py-6 md:pb-10">
      <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
        {home.chainTitle.replace(/\.\n/, " · ").replace(/\.$/, "")}
      </p>
      <RelationshipMap className="md:justify-center" activeName={activeName} />
    </div>
  );
}
