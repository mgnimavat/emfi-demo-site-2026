import { BrandSign } from "@/components/brand/logo";

function OrbitSign({
  orbit,
  size,
  opacity,
}: {
  orbit: "emfi-sign-orbit-a" | "emfi-sign-orbit-b";
  size: string;
  opacity: string;
}) {
  return (
    <div className={`emfi-sign-orbit ${orbit} flex items-center justify-center ${opacity}`}>
      <BrandSign className={`${size} emfi-sign-mark`} />
    </div>
  );
}

export function HeroAtmosphere({
  compact = false,
  sign = true,
}: {
  compact?: boolean;
  sign?: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-page" />
      <div className="emfi-hero-glow-tl absolute inset-0" />
      <div className="emfi-hero-glow-br absolute inset-0" />
      {compact ? (
        sign ? (
          <div className="absolute right-[5%] bottom-[10%] text-[var(--color-blue-100)]">
            <div className="relative flex h-[280px] w-[280px] items-center justify-center [perspective:1800px]">
              <OrbitSign orbit="emfi-sign-orbit-a" size="h-[280px] w-[280px]" opacity="opacity-[0.22]" />
            </div>
          </div>
        ) : null
      ) : sign ? (
        <>
          <div className="absolute top-[2%] right-[-4%] text-[var(--color-blue-100)]">
            <div className="emfi-sign-cluster relative flex h-[500px] w-[500px] items-center justify-center [perspective:1800px]">
              <span className="emfi-sign-glow absolute top-1/2 left-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-blue-100)_45%,transparent)] blur-3xl" />
              <OrbitSign orbit="emfi-sign-orbit-b" size="h-[440px] w-[440px]" opacity="opacity-[0.20]" />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 text-[var(--color-blue-100)]">
            <div className="relative flex h-[400px] w-[400px] items-center justify-center [perspective:1800px]">
              <OrbitSign orbit="emfi-sign-orbit-a" size="h-[400px] w-[400px]" opacity="opacity-[0.22]" />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function HeroBrandMark() {
  return (
    <div className="emfi-hero-mark" aria-hidden>
      <BrandSign className="emfi-hero-mark-base h-auto w-full" />
      <span className="emfi-hero-mark-lit">
        <BrandSign className="h-auto w-full" />
      </span>
      <span className="emfi-hero-mark-core">
        <BrandSign className="h-auto w-full" />
      </span>
    </div>
  );
}
