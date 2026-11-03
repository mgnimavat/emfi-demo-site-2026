import { execution } from '@/content/execution';
import { ResearchToTrade } from '@/components/sections/execution/research-to-trade';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ResearchSection } from '@/components/sections/execution/research-section';
import { WorkstationSection } from '@/components/sections/execution/workstation-section';
import { ResearchDisclosures } from '@/components/sections/execution/research-disclosures';
import theme from '@/components/sections/archive/theme.module.css';
import styles from '@/components/sections/execution/page.module.css';

export const metadata = {
  title: execution.title,
  description: execution.description,
  robots: { index: false, follow: true },
};

const ResearchExecutionFullBlurPage = () => (
  <div className={theme.page}>
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <ExecutionReveal className={styles.heroCopy}>
            <ExecutionHeroTitle />
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={styles.heroMedia}>
            <ResearchToTrade />
          </ExecutionReveal>
        </div>
      </div>
    </section>
    <ResearchSection />
    <WorkstationSection maskVariant="blur" />
    <ResearchDisclosures />
  </div>
);

export default ResearchExecutionFullBlurPage;
