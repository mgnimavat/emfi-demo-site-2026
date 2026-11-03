import type { ReactNode } from 'react';
import { ExecutionHeroPhrases } from '@/components/sections/execution/hero-phrases';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import heroStyles from '@/components/sections/execution/page.module.css';

type ServiceHeroProps = {
  lines: readonly string[];
  phrases: readonly string[];
  typewriter?: { prefix: string; words: readonly string[] };
  visual?: ReactNode;
  taglineClassName?: string;
  headlineClassName?: string;
};

export const ServiceHero = ({ lines, phrases, typewriter, visual, taglineClassName, headlineClassName }: ServiceHeroProps) => (
  <section className={heroStyles.hero}>
    <div className={heroStyles.container}>
      <div className={heroStyles.heroGrid}>
        <ExecutionReveal className={heroStyles.heroCopy}>
          {typewriter ? (
            <ExecutionHeroTitle
              headline={lines.join('\n')}
              prefix={typewriter.prefix}
              words={typewriter.words}
              taglineClassName={taglineClassName}
              headlineClassName={headlineClassName}
            />
          ) : (
            <>
              <h1 className={headlineClassName}>
                {lines.map((line) => <span key={line}>{line}</span>)}
              </h1>
              <ExecutionHeroPhrases phrases={phrases} />
            </>
          )}
        </ExecutionReveal>
        {visual ? <ExecutionReveal delay={0.12} className={heroStyles.heroMedia}>{visual}</ExecutionReveal> : null}
      </div>
    </div>
  </section>
);
