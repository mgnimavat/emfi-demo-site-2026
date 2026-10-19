import Image from "next/image";

/** Original recovered wordmark; preserve its 750 × 302 viewBox proportions. */
export function BrandWordmark({ width = 140, className, priority = false }: { width?: number; className?: string; priority?: boolean }) {
  return <Image src="/brand/archive-footer-logo.svg" alt="EMFI" width={width} height={Math.round(width * 302 / 750)} className={className} priority={priority} />;
}
