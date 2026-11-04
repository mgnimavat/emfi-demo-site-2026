import { directAccess as copy } from '@/content/direct-access';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { DirectAccessSections } from '@/containers/Sections/DirectAccessSections';
import { SettlementHeroAnimation } from '@/containers/Sections/SettlementHeroAnimation';
import hero from '@/components/sections/execution/page.module.css';

export const metadata = { title: copy.title, description: copy.description };

const DirectAccessPage = () => (
  <div>
    <section className={hero.hero}>
      <div className={hero.container}>
        <div className={hero.heroGrid}>
          <ExecutionReveal className={hero.heroCopy}>
            <ExecutionHeroTitle headline={copy.headline} prefix={copy.heroTitle.prefix} words={copy.heroTitle.words} />
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={hero.heroMedia}>
            <SettlementHeroAnimation showTitle={false} />
          </ExecutionReveal>
        </div>
      </div>
    </section>
    <DirectAccessSections />
  </div>
);

export default DirectAccessPage;
