import { ExecutionHeroPhrases } from '@/components/sections/execution/hero-phrases';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import heroStyles from '@/components/sections/execution/page.module.css';

type ServiceHeroProps = {
  lines: readonly string[];
  phrases: readonly string[];
};

export const ServiceHero = ({ lines, phrases }: ServiceHeroProps) => (
  <section className={heroStyles.hero}>
    <div className={heroStyles.container}>
      <div className={heroStyles.heroGrid}>
        <ExecutionReveal className={heroStyles.heroCopy}>
          <h1>
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <ExecutionHeroPhrases phrases={phrases} />
        </ExecutionReveal>
      </div>
    </div>
  </section>
);
